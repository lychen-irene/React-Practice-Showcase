const ProductEditHeader = function ({ products, openProductModal }) {
  return (
    <>

      <thead className="">
        <tr>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>查看細節</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
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
        ))}
      </tbody>

    </>
  )
}

export default ProductEditHeader
