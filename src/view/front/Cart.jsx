import { useEffect, useCallback, useState } from 'react'
import axios from 'axios'
import 'bootstrap'
import Swal from 'sweetalert2'

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

function Cart() {
  // API path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH

  const [cart, setCart] = useState([])

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
      // eslint-disable-next-line
      const res = await axios.put(url, { data })
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

  useEffect(
    function () {
      // eslint-disable-next-line
      getCart()
    }, [getCart])

  return (
    <>
      <div className="container">
        <h2>Cart Page</h2>
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
                    <td>
                      <div className="d-flex">
                        <input
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
    </>
  )
}

export default Cart
