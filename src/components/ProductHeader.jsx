const ProductHeader = function ({ products, setTempProduct }) {
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
            <td className="align-middle">
              {product.is_enabled ? '已啟用' : '未啟用'}
            </td>
            <td className="align-middle">
              <button className="btn btn-secondary" onClick={() => setTempProduct(product)}>查看細節</button>
            </td>
          </tr>
        ))}
      </tbody>

    </>
  )
}

export default ProductHeader
