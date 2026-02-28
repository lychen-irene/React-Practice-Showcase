import { useEffect } from 'react'
import 'bootstrap'
import useCart from '../../hooks/useCart'

function Cart() {
  const { cart, getCart, deleteItem, clearCart, updateItem } = useCart()

  useEffect(function () {
    getCart()
  }, [getCart]) // 在 useCart.js 的 getCart 加上 useCallback 才可加入，避免無限次渲染

  return (
    <>
      <div className="container">
        <h2>購物車</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-danger my-3"
            onClick={() => clearCart()}
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
            {cart?.carts?.length === 0
              ? <tr><td colSpan="4">購物車沒有商品</td></tr>
              : cart?.carts?.map(cartItem => (
                  <tr key={cartItem.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(cartItem.id)}
                      >
                        刪除
                      </button>
                    </td>
                    <td className="align-middle">{cartItem.product.title}</td>
                    <td className="cart">
                      <div className="d-flex">
                        <input
                          type="number"
                          className="form-control text-end"
                          aria-label="Sizing example input"
                          aria-describedby="inputGroup-sizing-sm"
                          defaultValue={cartItem.qty}
                          onChange={e =>
                            updateItem(
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
                ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">總計</td>
              <td className="text-middel">{cart.final_total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default Cart
