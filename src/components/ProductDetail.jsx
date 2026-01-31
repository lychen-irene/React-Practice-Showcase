const ProductDetail = function ({ tempProduct }) {
  return (
    <>
      <div className="card border-secondary mb-3">
        <img src={tempProduct.imageUrl} className="card-img-top primary-image" alt={tempProduct.title} />
        <div className="card-body">
          <h5 className="card-title">
            {tempProduct.title}
            <span className="badge bg-secondary ms-2">{tempProduct.category}</span>
          </h5>
          <p className="card-text">
            商品描述：
            {tempProduct.description}
          </p>
          <p className="card-text">
            商品內容：
            {tempProduct.content}
          </p>
          <div className="d-flex">
            <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
            元 /
            {' '}
            {tempProduct.price}
            {' '}
            元
          </div>
          <h5 className="mt-3">更多圖片：</h5>
          <div className="d-flex flex-wrap">
            {tempProduct.imagesUrl?.map((url, index) => (
              <img key={index} src={url} className="card-img-top" alt={tempProduct.title} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail
