import { useEffect, useCallback, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { ColorRing } from 'react-loader-spinner'

import axios from 'axios'
import * as bootstrap from 'bootstrap'
import SingleProductModal from '../../components/SingleProductModal'

import { Toast } from '../../utils/toast'

function Checkout() {
  // API path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH

  const [product, setProduct] = useState({})
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [modalQty, setModalQty] = useState(1)
  const [loadingCartId, setLoadingCartId] = useState(null)
  const [loadingProductId, setLoadingProductId] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(
    { mode: 'onBlur' }, // 離開欄位才檢查
  )
  const productModalRef = useRef(null)

  const getCart = useCallback(async function () {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/cart`)
      setCart(res.data.data)
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to load cart list',
      })
    }
  }, [apiBaseUrl, apiPath])

  // Clear the whole cart list
  const deleteCartAll = async () => {
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/carts`
      await axios.delete(url)
      getCart()
      Toast.fire({
        icon: 'success',
        title: 'Clear the whole cart successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to clear the whole cart list',
      })
    }
  }

  // Delete specific product
  const deleteCart = async (cartId) => {
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/cart/${cartId}`
      // eslint-disable-next-line
      const res = await axios.delete(url)
      getCart()
      Toast.fire({
        icon: 'success',
        title: 'Delete the product from cart list successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to delete the product from cart list',
      })
    }
  }

  // Update product quantity
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/cart/${cartId}`
      const data = {
        product_id: productId,
        qty,
      }
      await axios.put(url, { data })
      getCart()
      Toast.fire({
        icon: 'success',
        title: 'Update the product quantity in cart list successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to update product quantity in cart list',
      })
    }
  }

  const onSubmit = async (formData) => {
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/order`
      await axios.post(url, {
        data: { user: formData, message: formData.message },
      })
      reset()
      getCart()
      Toast.fire({
        icon: 'success',
        title: 'Successfully submit checkout form',
      })
    }
    catch (error) {
      console.error(error)
      Toast.fire({
        icon: 'error',
        title: 'Fail to submit checkout form',
      })
    }
  }

  useEffect(
    function () {
      async function getProducts() {
        try {
          const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/products/all`)
          setProducts(res.data.products)
        }
        catch {
          Toast.fire({
            icon: 'error',
            title: 'Fail to load product list',
          })
        }
      }
      getProducts()
      getCart()

      productModalRef.current = new bootstrap.Modal('#productModal', {
        keyboard: false,
      },
      )
      document
        .querySelector('#productModal')
        .addEventListener('hide.bs.modal', () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
        })
    }, [apiBaseUrl, apiPath, getCart])

  const addCart = async (id, num = 1) => {
    const existingItem = cart?.carts?.find(item => item.product_id === id)
    if (existingItem) {
      await updateCart(existingItem.id, id, existingItem.qty + num)
      return
    }

    setLoadingCartId(id)
    const data = {
      product_id: id,
      qty: num,
    }
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/cart`
      await axios.post(url, { data })
      getCart()
      Toast.fire({
        icon: 'success',
        title: 'Add to cart successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to add the product into cart',
      })
    }
    finally {
      setLoadingCartId(null)
    }
  }

  const handleView = async function (id) {
    setLoadingProductId(id)
    try {
      const res = await axios.get (
        `${apiBaseUrl}/api/${apiPath}/product/${id}`,
      )
      setProduct(res.data.product)
      const cartEntry = cart?.carts?.find(item => item.product_id === id)
      setModalQty(cartEntry?.qty ?? 1)
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to load single product',
      })
    }
    finally {
      setLoadingProductId(null)
    }

    productModalRef.current.show()
  }

  // Close Modal
  const closeProductModal = function () {
    productModalRef.current.hide()
  }

  return (
    <>
      <div className="container">

        {/* 產品列表 */}
        <div className="container m-5">
          <h2>Checkout Page</h2>
          <table className="table table-dark table-striped table-bordered border-secondary align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                products.map(product => (
                  <tr key={product.id}>
                    <td style={{ width: '200px' }}>
                      <div
                        style={{
                          height: '100px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundImage: `url(${product.imageUrl})`,
                        }}
                      >
                      </div>
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <del className="h6">
                        原價：
                        {product.origin_price}
                      </del>
                      <div className="h5">
                        特價：
                        {product.price}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => { handleView(product.id) }}
                          disabled={loadingProductId === product.id}
                        >
                          {
                            loadingProductId === product.id
                              ? (
                                  <span>
                                    <ColorRing
                                      height="24"
                                      width="24"
                                      colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                      ariaLabel="loading"
                                    />
                                  </span>
                                )
                              : '查看更多'
                          }
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => addCart(product.id)}
                          disabled={loadingCartId === product.id}
                        >
                          {
                            loadingCartId === product.id
                              ? (
                                  <span>
                                    <ColorRing
                                      height="24"
                                      width="24"
                                      colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                      ariaLabel="loading"
                                    />
                                  </span>
                                )
                              : '加到購物車'
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>

        {/* 購物車 */}

        <div className="container m-5">
          <h2>Cart List</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-danger my-3"
              onClick={() => deleteCartAll()}
            >
              清空購物車
            </button>
          </div>
          <table className="table table-dark table-striped table-bordered border-secondary">
            <thead>
              <tr>
                <th scope="col">功能</th>
                <th scope="col">品名</th>
                <th scope="col">數量/單位</th>
                <th scope="col">小計</th>
              </tr>
            </thead>
            <tbody>
              {cart?.carts?.length > 0
                ? cart?.carts?.map(cartItem => (
                    <tr key={cartItem.id}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCart(cartItem.id)}
                        >
                          刪除
                        </button>
                      </td>
                      <td className="align-middle">{cartItem.product.title}</td>
                      <td className="cart">
                        <div className="d-flex">
                          <input
                            key={`${cartItem.id}-${cartItem.qty}`}
                            type="number"
                            className="form-control text-end"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-sm"
                            defaultValue={cartItem.qty}
                            onChange={e =>
                              updateCart(
                                cartItem.id,
                                cartItem.product_id,
                                Number(e.target.value),
                              )}
                          />
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-middle align-middle">{cartItem.final_total}</td>
                    </tr>
                  ))

                : <tr><td colSpan="4">購物車沒有商品</td></tr>}

            </tbody>
            <tfoot>
              <tr>
                <td className="text-end" colSpan="3">
                  總計
                </td>
                <td className="text-middel">{cart.final_total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* 填寫資料 */}
        <div className="container m-5">
          <div className="conatainer checkout my-5 row text-start justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="請輸入 Email"
                  {...register('email', {
                    required: '請輸入 Email',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確',
                    } })}
                // defaultValue="test@gamil.com"
                />
                {errors.email && (
                  <p className="text-warning fw-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="form-label"
                >
                  收件人姓名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="請輸入姓名"
                  {...register('name', {
                    required: '請輸入收件人姓名',
                    minLength: { value: 2, message: '姓名至少 2 個字' },
                  })}
                // defaultValue="小明"
                />
                {errors.name && (
                  <p className="text-warning fw-bold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="tel"
                  className="form-label"
                >
                  收件人電話
                </label>
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  className="form-control"
                  placeholder="請輸入電話"
                  {...register('tel', {
                    required: '請輸入收件人電話',
                    minLength: { value: 8, message: '電話至少 8 碼' },
                    pattern: {
                      value: /^\d+$/,
                      message: '電話僅能輸入數字',
                    },
                  })}
                // defaultValue="0912345678"
                />
                {errors.tel && (
                  <p className="text-warning fw-bold">
                    {errors.tel.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="請輸入地址"
                  {...register('address', {
                    required: '請輸入收件人地址',
                  })}
                // defaultValue="臺北市信義區信義路5段7號"
                />
                {errors.address && (
                  <p className="text-warning fw-bold">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="message"
                  className="form-label"
                >
                  留言
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  cols="30"
                  rows="10"
                  {...register('message')}
                >
                </textarea>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  送出訂單
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <SingleProductModal
        product={product}
        cartItem={cart?.carts?.find(item => item.product_id === product.id)}
        cartQty={modalQty}
        setCartQty={setModalQty}
        addCart={addCart}
        updateCart={updateCart}
        closeProductModal={closeProductModal}
      />
    </>
  )
}

export default Checkout
