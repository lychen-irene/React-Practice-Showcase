import { useEffect, useState } from 'react'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

const ProductModal = function ({
  modalType,
  productModalRef,
  templateProductData,
  closeProductModal,
  setIsProductsLoading,
  getProducts,
  Toast,
}) {
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
        setIsProductsLoading={setIsProductsLoading}
        getProducts={getProducts}
        Toast={Toast}
      />
    </div>
  )
}

const ProductModelContent = function ({
  modalType,
  templateProductData,
  closeProductModal,
  setIsProductsLoading,
  getProducts,
  Toast,
}) {
  // Create another useState for avoiding data contamination
  const [tempData, setTempData] = useState(templateProductData)

  // Update new data when selecting different product
  useEffect(function () {
    setTempData(templateProductData)
  }, [templateProductData])

  // Create or update product info
  const updateProducts = async function (id, showLoading = true) {
    if (showLoading) setIsProductsLoading(true)
    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        rate: Number(tempData.rate),
        imagesUrl: [...tempData.imagesUrl.filter(url => url !== '')],
      },
    }
    if (modalType === 'create') {
      try {
      // eslint-disable-next-line
      const res = await axios.post(
          `${apiBaseUrl}/api/${apiPath}/admin/product`, productData,
        )
        await getProducts(false)
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
        await getProducts(false)
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

  // Catch input content of edit type model
  const handleModalInputChange = function (e) {
    const { name, value, checked, type } = e.target
    setTempData(function (preProductData) {
      return {
        ...preProductData,
        [name]: type === 'checkbox' ? checked : value,
      }
    })
  }

  // Catch img input content of edit type model
  const handleModalImgChange = function (index, value) {
    setTempData(function (preProductData) {
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
    setTempData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.push('')
      return {
        ...preProductData,
        imagesUrl: newImg }
    })
  }

  // Delete product
  const deleteProductData = async function (id, showLoading = true) {
    if (showLoading) setIsProductsLoading(true)
    try {
    // eslint-disable-next-line
      const res = await axios.delete(
        `${apiBaseUrl}/api/${apiPath}/admin/product/${id}`,
      )
      await getProducts(false)
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
      setIsProductsLoading(false)
      closeProductModal()
    }
  }

  // Delete existing image
  const handleDeleteImgChange = () => {
    setTempData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.pop()
      return { ...preProductData, imagesUrl: newImg }
    })
  }

  // Upload img from local host
  const uploadImg = async function (e) {
    const file = e.target.files?.[0]
    if (!file) {
      Toast.fire({
        icon: 'error',
        title: 'No file is selected',
      })
      return
    }
    try {
      const formData = new FormData()
      formData.append('file-to-upload', file)
      // eslint-disable-next-line
  const res = await axios.post(`${apiBaseUrl}/api/${apiPath}/admin/upload`, 
        formData)
      setTempData(function (pre) {
        return {
          ...pre,
          imageUrl: res.data.imageUrl,
        }
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Failed to upload the file',
      })
    }
  }

  return (
    <>
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
                    <span className="text-red">
                      {' '}
                      {tempData.title}
                      {' '}
                    </span>
                    嗎？
                  </p>
                )
              : (
                  <div className="row">
                    <div className="col-sm-4">
                      <div className="mb-2">
                        <div className="mb-3">
                          <label htmlFor="file-to-upload" className="form-label">
                            選擇上傳圖片
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="file-to-upload"
                            id="file-to-upload"
                            accept=".jpg, .jpeg, .png"
                            onChange={e => uploadImg(e)}
                          />
                          {/* <input type="submit" value="Upload"></input> */}
                        </div>
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
                            defaultValue={tempData.imageUrl}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        {tempData.imageUrl && (
                          <img
                            className="img-fluid"
                            src={tempData.imageUrl}
                            alt="主圖"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div>
                        {tempData.imagesUrl.map(function (url, index) {
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
                                onChange={e => handleModalImgChange(index, e.target.value)}
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
                          onClick={handleAddImgChange}
                        >
                          新增圖片
                        </button>
                      </div>
                      <div>
                        <button
                          className="btn btn-danger btn-sm d-block w-100 mt-2"
                          onClick={handleDeleteImgChange}
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
                          defaultValue={tempData.title}
                          onChange={handleModalInputChange}
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
                            defaultValue={tempData.category}
                            onChange={handleModalInputChange}
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
                            defaultValue={tempData.unit}
                            onChange={handleModalInputChange}
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
                            defaultValue={tempData.origin_price}
                            onChange={handleModalInputChange}
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
                            defaultValue={tempData.price}
                            onChange={handleModalInputChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label htmlFor="rate" className="form-label">商品評價</label>
                          <input
                            name="rate"
                            id="rate"
                            type="number"
                            min="0"
                            max="5"
                            className="form-control"
                            placeholder="請輸入評分 ( 0 非常不滿意～ 5 非常滿意）"
                            defaultValue={tempData.rate}
                            onChange={handleModalInputChange}
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
                          defaultValue={tempData.description}
                          onChange={handleModalInputChange}
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
                          defaultValue={tempData.content}
                          onChange={handleModalInputChange}
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
                            checked={!!tempData.is_enabled}
                            onChange={handleModalInputChange}
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
                    onClick={() => deleteProductData(tempData.id)}
                  >
                    刪除
                  </button>
                )
              : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => updateProducts(tempData.id)}
                  >
                    確認
                  </button>
                )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductModal
export { ProductModelContent }
