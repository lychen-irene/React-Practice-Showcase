const SingleProductModal = function ({
  product, cartItem, cartQty, setCartQty, addCart, updateCart, closeProductModal,
}) {
  const handleAddCart = function () {
    if (cartItem) {
      updateCart(cartItem.id, product.id, cartQty)
    }
    else {
      addCart(product.id, cartQty)
    }
    closeProductModal()
  }

  return (
    <>
      <div className="modal" id="productModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-white bg-black">
              <h5 className="modal-title">
                產品名稱：
                {product.title}
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
              <img className="w-100" src={product.imageUrl} alt={product.title} />
              <p className="mt-3">
                產品內容：
                {product.content}
              </p>
              <p>
                產品描述：
                {product.description}
              </p>
              <p>
                價錢：
                <del>
                  原價 $
                  {product.origin_price}
                </del>
                ，特價：$
                {product.price}
              </p>
              <div className="d-flex align-items-center">
                <label htmlFor="quantity" style={{ width: '250px' }}>購買數量：</label>
                <button
                  className="btn btn-danger btn-sm d-block w-25 mt-2"
                  type="button"
                  id="button-addon1"
                  aria-label="Decrease quantity"
                  onClick={() => setCartQty(pre => pre === 1 ? 1 : pre - 1)}
                >
                  減1
                </button>
                <input
                  style={{ width: '100px' }}
                  id="quantity"
                  className="form-control text-end"
                  type="number"
                  min="1"
                  max="10"
                  value={cartQty}
                  onChange={e => setCartQty(Number(e.target.value))}
                />
                <button
                  className="btn btn-primary btn-sm d-block w-25 mt-2"
                  type="button"
                  id="button-addon2"
                  aria-label="Decrease quantity"
                  onClick={() => setCartQty(pre => pre + 1)}
                >
                  加1
                </button>
              </div>
            </div>
            <div className="modal-footer bg-black">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAddCart()}
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleProductModal
