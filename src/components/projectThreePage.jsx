import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import Swal from 'sweetalert2'

import Navbar, { titles } from './Navbar'
import Footer from './Footer'

// Login form page
const LoginForm = function ({ onSubmit, formData, onChange }) {
  return (
    <div className="container login">
      <h2>請先登入</h2>
      <form className="form-floating" onSubmit={onSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={onChange}
            required
            autoFocus
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-lg btn-secondary w-20 mt-4" type="submit">
          登入
        </button>
      </form>
    </div>
  )
}

// Login loading animation
const LoginLoading = function () {
  return (
    <div className="spinner-border m-5 text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

// Get login token from cookie
const getToken = function () {
  return document.cookie
    .split('; ')
    .find(function (row) {
      return (row.startsWith('hexToken='))
    })
    ?.split('=')[1]
}
// const function statement only due to document.cookie changes over time (e.g., after login)

// SweetAlert popup type
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: function (toast) {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

// Add new product button
const AddNewProduct = function ({ onClick }) {
  return (
    <div className="text-end mt-4">
      <button
        className="btn btn-primary mb-5"
        type="button"
        onClick={onClick}
      >
        建立新的產品
      </button>
    </div>
  )
}

// Product api post format
const INITIAL_TEMPLATE_PRODUCT_DATA = {
  data:
  { id: '',
    title: '',
    category: '',
    origin_price: null,
    price: null,
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: '',
    imagesUrl: [],
  } }

// Product thead
const ProductsThead = function () {
  return (
    <thead>
      <tr>
        <th>產品分類</th>
        <th>產品名稱</th>
        <th>原價</th>
        <th>售價</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
  )
}

// Products list table
// 第二層：負責單一 <tr> 的渲染
const ProductRow = function ({ product, openProductModal }) {
  return (
    <tr>
      <td className="align-middle">{product.category}</td>
      <td className="align-middle">{product.title}</td>
      <td className="align-middle">{product.origin_price}</td>
      <td className="align-middle">{product.price}</td>
      <td
        className={`align-middle ${product.is_enabled ? '' : 'text-secondary'}`}
      >
        {product.is_enabled ? '已啟用' : '未啟用'}
      </td>
      <td className="align-middle">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openProductModal('edit', product)}
          >
            編輯
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => openProductModal('delete', product)}
          >
            刪除
          </button>
        </div>
      </td>
    </tr>
  )
}

// 第一層：負責 <tbody> + .map()
const ProductsList = function ({ products, openProductModal }) {
  return (
    <tbody>
      {products.map(function (product) {
        return (
          <ProductRow
            key={product.id}
            product={product}
            openProductModal={openProductModal}
          />
        )
      },
      )}
    </tbody>
  )
}

// Modal button
const ProductModal = function ({
  modalType,
  productModalRef,
  templateProductData,
  onChange, onImgChange,
  onClickAddImg,
  onClickDeleteImg,
  closeProductModal,
  updateProducts,
  deleteProductData }) {
  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModal"
      aria-hidden="true"
      ref={productModalRef}
    >
      <ProductModelContent
        modalType={modalType}
        templateProductData={templateProductData}
        closeProductModal={closeProductModal}
        onChange={onChange}
        onImgChange={onImgChange}
        onClickAddImg={onClickAddImg}
        onClickDeleteImg={onClickDeleteImg}
        updateProducts={updateProducts}
        deleteProductData={deleteProductData}
      />
    </div>
  )
}

// Modal content
const ProductModelContent = function ({
  modalType,
  templateProductData,
  onChange, onImgChange,
  onClickAddImg,
  onClickDeleteImg,
  closeProductModal,
  updateProducts,
  deleteProductData,
}) {
  return (

    <div className="modal-dialog modal-xl">
      <div className="modal-content border-0">
        <div className={`modal-header text-white 
          bg-${modalType === 'delete' ? 'danger' : 'black'}`}
        >
          <h5 id="productModalLabel" className="modal-title">
            {modalType === 'create'
              ? <span>新增產品</span>
              : modalType === 'edit'
                ? <span>編輯產品</span>
                : <span>刪除產品</span>}
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
          </button>
        </div>
        <div className="modal-body bg-black text-white text-start">
          {modalType === 'delete'
            ? (
                <p className="fs-4">
                  確定要刪除
                  <span className="text-red">{templateProductData.title}</span>
                  嗎？
                </p>
              )
            : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          id="imageUrl"
                          name="imageUrl"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          defaultValue={templateProductData.imageUrl}
                          onChange={onChange}
                        />
                      </div>
                      {templateProductData.imageUrl && (
                        <img
                          className="img-fluid"
                          src={templateProductData.imageUrl}
                          alt="主圖"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div>
                      {templateProductData.imagesUrl.map(function (url, index) {
                        return (
                          <div key={index}>
                            <label htmlFor="imageUrl" className="form-label">
                              輸入圖片網址
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`圖片網址${index + 1}`}
                              defaultValue={url}
                              onChange={e => onImgChange(index, e.target.value)}
                            />
                            {url
                              && (
                                <img
                                  className="img-fluid"
                                  src={url}
                                  alt={`副圖${index + 1}`}
                                  referrerPolicy="no-referrer"
                                />
                              )}
                          </div>
                        )
                      },
                      )}
                      <button
                        className="btn btn-primary btn-sm d-block w-100 mt-2"
                        onClick={onClickAddImg}
                      >
                        新增圖片
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger btn-sm d-block w-100 mt-2"
                        onClick={onClickDeleteImg}
                      >
                        刪除圖片
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input
                        name="title"
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        defaultValue={templateProductData.title}
                        onChange={onChange}
                      />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input
                          name="category"
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          defaultValue={templateProductData.category}
                          onChange={onChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input
                          name="unit"
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          defaultValue={templateProductData.unit}
                          onChange={onChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">原價</label>
                        <input
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          defaultValue={templateProductData.origin_price}
                          onChange={onChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input
                          name="price"
                          id="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          defaultValue={templateProductData.price}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">產品描述</label>
                      <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        defaultValue={templateProductData.description}
                        onChange={onChange}
                      >
                      </textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">說明內容</label>
                      <textarea
                        name="content"
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        defaultValue={templateProductData.content}
                        onChange={onChange}
                      >
                      </textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          name="is_enabled"
                          id="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={!!templateProductData.is_enabled}
                          onChange={onChange}
                        />
                        <label className="form-check-label" htmlFor="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
        </div>
        <div className="modal-footer bg-black">
          <button
            type="button"
            className="btn btn-dark"
            data-bs-dismiss="modal"
            onClick={closeProductModal}
          >
            取消
          </button>
          {modalType === 'delete'
            ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProductData(templateProductData.id)}
                >
                  刪除
                </button>
              )
            : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateProducts(templateProductData.id)}
                >
                  確認
                </button>
              )}
        </div>
      </div>
    </div>

  )
}

// Product loading animation
const ProductsLoading = function () {
  return (
    <thead className="spinner-border m-5 text-light" role="status">
      <tr>
        <th className="visually-hidden">Loading...</th>
      </tr>
    </thead>
  )
}

// Product Page Button
const ProductPageButton = function ({ totalPage, setProductPage }) {
  return (
    Array.from({ length: totalPage }, (_, index) => (
      <button
        type="button"
        className="btn btn-black text-white px-2 mx-1 mb-4"
        key={index}
        onClick={() => setProductPage(index + 1)}
      >
        {index + 1}
      </button>
    ))
  )
}

// Main Content
const ProjectThreePage = function () {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [authStatus, setAuthStatus] = useState(function () {
    return (getToken() ? 'loading' : 'unauth')
  },
  )
  const [products, setProducts] = useState([])
  const [productPage, setProductPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [templateProductData, setTemplateProductData] = useState(INITIAL_TEMPLATE_PRODUCT_DATA.data)
  const [modalType, setModalType] = useState('')

  // Catch login form input content
  const handleLoginInputChange = function (e) {
    const { name, value } = e.target
    setFormData(function (preData) {
      return {
        ...preData,
        [name]: value,
      }
    })
  }

  // Action after clicking login button
  const onSubmit = async function (e) {
    try {
      e.preventDefault()
      setIsLoginLoading(true)
      const res = await axios.post(`${apiBaseUrl}/admin/signin`, formData)
      const { token, expired } = res.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`
      axios.defaults.headers.common['Authorization'] = token
      await getProducts(true)
      setAuthStatus('auth')
      Toast.fire({
        icon: 'success',
        title: 'Sign in successfully',
      })
    }
    catch {
      setAuthStatus('unauth')
      Toast.fire({
        icon: 'error',
        title: 'Fail to sign in',
      })
    }
    finally {
      setIsLoginLoading(false)
    }
  }

  // Get all products info from API
  const getProducts = useCallback(
    async function (showLoading = true) {
      if (showLoading) setIsProductsLoading(true)
      try {
        const res = await axios.get(
          `${apiBaseUrl}/api/${apiPath}/admin/products?page=${productPage}`,
        )
        // store pages info
        setProducts(res.data.products)
        setProductPage(res.data.pagination.current_page)
        setTotalPage(res.data.pagination.total_pages)
      }
      catch {
        Toast.fire({
          icon: 'error',
          title: 'Fail to load product list',
        })
      }
      finally {
        setIsProductsLoading(false)
      }
    },
    [apiBaseUrl, apiPath, productPage],
  )

  // Create or update product info
  const updateProducts = async function (id, showLoading = true) {
    if (showLoading) setIsProductsLoading(true)

    const productData = {
      data: {
        ...templateProductData,
        origin_price: Number(templateProductData.origin_price),
        price: Number(templateProductData.price),
        imagesUrl: [...templateProductData.imagesUrl.filter(url => url !== '')],
      },
    }

    if (modalType === 'create') {
      try {
        // eslint-disable-next-line
        const res = await axios.post(
          `${apiBaseUrl}/api/${apiPath}/admin/product`, productData,
        )
        await getProducts(true)
        Toast.fire({
          icon: 'success',
          title: 'Create a new product successfully',
        })
      }
      catch {
        Toast.fire({
          icon: 'error',
          title: 'Fail to create a new product',
        })
      }
      finally {
        setIsProductsLoading(false)
        closeProductModal()
      }
    }
    else {
      try {
        // eslint-disable-next-line
        const res = await axios.put(
          `${apiBaseUrl}/api/${apiPath}/admin/product/${id}`, productData,
        )
        await getProducts(true)
        Toast.fire({
          icon: 'success',
          title: 'Update product successfully',
        })
      }
      catch {
        Toast.fire({
          icon: 'error',
          title: 'Fail to update product',
        })
      }
      finally {
        setIsProductsLoading(false)
        closeProductModal()
      }
    }
  }

  // Delete product
  const deleteProductData = async (id) => {
    try {
      // eslint-disable-next-line
      const res = await axios.delete(
        `${apiBaseUrl}/api/${apiPath}/admin/product/${id}`,
      )
      Toast.fire({
        icon: 'success',
        title: 'Delete product successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to delete product',
      })
    }
    finally {
      closeProductModal()
      getProducts(false)
    }
  }

  // Check token is valid or not
  const checkLogin = useCallback(
    async function (showMsg = true) {
      try {
        // Get token from Cookie
        const token = getToken()
        if (token) {
          axios.defaults.headers.common['Authorization'] = token
          // check token is valid or not
          // eslint-disable-next-line
          const res = await axios.post(`${apiBaseUrl}/api/user/check`);
          await getProducts(false)
          setAuthStatus('auth')
          if (showMsg) {
            Toast.fire({
              icon: 'success',
              title: 'Check success: token is valid',
            })
          }
        }
        else {
          setAuthStatus('unauth')
          Toast.fire({
            icon: 'error',
            title: 'Check failed: token not found, please sign in again',
          })
        }
      }
      catch {
        setTimeout(function () {
          setAuthStatus('unauth')
        }, 0)
        if (showMsg) {
          Toast.fire({
            icon: 'error',
            title: 'Check failed: token is invalid',
          })
        }
      }
    },
    [apiBaseUrl, getProducts],
  )

  // Prevent checkLogin and SweetAlert popup run twice
  const hasChecked = useRef(false)
  useEffect(
    function () {
      if (!hasChecked.current) {
        hasChecked.current = true // prevent checkLogin run twice on strict mode
        setTimeout(function () {
          checkLogin(false) // SweetAlert will not be triggered because shwMsg = false
          // checkLogin() // SweetAlert always shows when pages is refreshed
        }, 0)
      }
    },
    [checkLogin],
  )

  // Auto logout when other 401 error comes out
  useEffect(function () {
    // 註冊 interceptor
    const interceptor = axios.interceptors.response.use(
      function (response) { return (response) },
      function (error) {
        if (error.response?.status === 401) {
          // delete cookie by setting expired time into past time
          document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
          setAuthStatus('unauth')
          Toast.fire({
            icon: 'error',
            title: 'Token is invalid, please sign in again',
          })
        }
        return Promise.reject(error)
      },
    )

    // 清除 interceptor（元件卸載時）
    return function () {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  // Prevent Modal being reset
  const productModalRef = useRef(null)
  useEffect(function () {
    if (authStatus === 'auth') {
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
    }
  }, [authStatus])

  // Open specific type of Modal
  const openProductModal = function (type, product) {
    setModalType(type)
    setTemplateProductData(function (preProductData) {
      return {
        ...preProductData,
        ...product,
      }
    })
    productModalRef.current.show()
  }

  // Close Modal
  const closeProductModal = function () {
    productModalRef.current.hide()
  }

  // Catch input content of edit type model
  const handleModalInputChange = function (e) {
    const { name, value, checked, type } = e.target
    setTemplateProductData(function (preProductData) {
      return {
        ...preProductData,
        [name]: type === 'checkbox' ? checked : value,
      }
    })
  }

  // Catch img input content of edit type model
  const handleModalImgChange = function (index, value) {
    setTemplateProductData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg[index] = value
      // Add new input box after filling img url
      if (
        value !== ''
        && index === newImg.length - 1
        && newImg.length < 5
      ) {
        newImg.push('')
      }

      // Remove new input box after clearing img url
      if (
        value === ''
        && newImg.length > 1
        && newImg[newImg.length - 1] === ''
      ) {
        newImg.pop()
      }
      return {
        ...preProductData,
        imagesUrl: newImg,
      }
    })
  }

  // Add new image
  const handleAddImgChange = () => {
    setTemplateProductData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.push('')
      return {
        ...preProductData,
        imagesUrl: newImg }
    })
  }

  // Delete existing image
  const handleDeleteImgChange = () => {
    setTemplateProductData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.pop()
      return { ...preProductData, imagesUrl: newImg }
    })
  }

  // Rerender product list when page changes
  const prevProductPage = useRef(productPage)
  useEffect(function () {
    if (authStatus === 'auth' && prevProductPage.current !== productPage) {
      getProducts(true)
    }
    prevProductPage.current = productPage
  }, [productPage, authStatus, getProducts])

  return (
    <>
      <div>
        <Navbar>
          {titles.map(function (item) {
            return (
              <li className="nav-item" key={item.id}>
                {item.title === 'About'
                  ? (
                      <a className="nav-link" aria-current="page" href={item.url}>
                        {item.title}
                      </a>
                    )
                  : (
                      <a className="nav-link" href={item.url}>
                        {item.title}
                      </a>
                    )}
              </li>
            )
          })}
        </Navbar>
        {authStatus === 'loading' && (
          <div className="d-flex justify-content-center">
            <LoginLoading />
          </div>
        )}
        {authStatus === 'auth' && (
          <div className="container-fluid my-4">
            <div className="container">
              <div className="sticky-header py-2 my-4">
                <AddNewProduct
                  onClick={() => openProductModal('create', INITIAL_TEMPLATE_PRODUCT_DATA.data)}
                />
                <h2>產品列表</h2>
                <p>
                  以下產品資料來源為
                  {/* rel="noopener noreferrer" for prevent phishing */}
                  {/* space within text */}
                  <a
                    href="https://www.stonexp.idv.tw/i.h?cls=40&pg=0,1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    石探紀：茶包的礦物化石網站
                  </a>
                  <br />
                  此列表僅供作業練習與面試使用，非商業性質用途
                </p>
              </div>
              <div className="table">
                <table className="table table-dark table-striped table-bordered border-secondary">
                  {!isProductsLoading
                    ? (
                        <>
                          <ProductsThead />
                          <ProductsList
                            products={products}
                            openProductModal={openProductModal}
                          />
                        </>
                      )
                    : (
                        <ProductsLoading />
                      )}
                </table>
              </div>
            </div>
          </div>
        )}
        {authStatus === 'unauth' && (
          <div className="d-flex justify-content-center">
            {!isLoginLoading
              ? (
                  <LoginForm
                    onSubmit={onSubmit}
                    formData={formData}
                    onChange={handleLoginInputChange}
                  />
                )
              : (
                  <LoginLoading />
                )}
          </div>
        )}
        <ProductModal
          modalType={modalType}
          ref={productModalRef}
          onClick={closeProductModal}
          templateProductData={templateProductData}
          onChange={handleModalInputChange}
          onImgChange={handleModalImgChange}
          onClickAddImg={handleAddImgChange}
          onClickDeleteImg={handleDeleteImgChange}
          updateProducts={updateProducts}
          deleteProductData={deleteProductData}
        />

        <ProductPageButton totalPage={totalPage} setProductPage={setProductPage} />

        <Footer />
      </div>
    </>
  )
}

export default ProjectThreePage
