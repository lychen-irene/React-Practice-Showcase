import { useEffect, useRef } from 'react'
// Import React Hook form for efficiency, validation and avoiding data contamination
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
  // Form validation
  const productSchema = z.object({
    title: z.string().min(1, '標題必填'),
    category: z.string().min(1, '分類必填'),
    origin_price: z.number({ message: '原價必須是數字' }).min(1, '原價需大於 0'),
    price: z.number({ message: '售價必須是數字' }).min(1, '售價需大於 0'),
    unit: z.string().min(1, '單位必填'),
    description: z.string().optional(),
    content: z.string().optional(),
    is_enabled: z.boolean().optional(),
    imageUrl: z.union([
      z.url({ message: '請輸入有效的圖片網址' }),
      z.literal(''),
    ]).optional(),
    imagesUrl: z.array(
      z.object({
        value: z.union([
          z.url({ message: '請輸入有效的圖片網址' }),
          z.literal(''),
        ]).optional(),
      }),
    ).optional(),
    rate: z.number().min(0, '售價需大於 0').max(5, '售價需大於 0').optional(),
  })

  // Zod validation lib
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  })

  // Show preview image
  const imageUrl = watch('imageUrl')
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'imagesUrl',
  })

  // Upload file Ref
  const fileInputRef = useRef(null)

  // Update new data when selecting different product
  useEffect(function () {
    const formData = {
      ...templateProductData,
      imagesUrl: templateProductData.imagesUrl?.map(url => ({ value: url })) || [],
    }
    reset(formData)
  }, [templateProductData, reset])

  // Create or update product info
  const onSubmit = (data) => {
    const productData = {
      ...data,
      imagesUrl: data.imagesUrl
        ?.map(item => item.value)
        .filter(url => url !== '') || [],
    }
    updateProducts(templateProductData.id, productData)
  }

  const updateProducts = async function (id, formData, showLoading = true) {
    if (showLoading) setIsProductsLoading(true)
    const productData = {
      data: formData,
    }

    const modalConfig = {
      create: {
        method: 'post',
        apiUrl: `${apiBaseUrl}/api/${apiPath}/admin/product`,
        successMsg: { icon: 'success',
          title: 'Create a new product successfully' },
        errorMsg: { icon: 'error',
          title: 'Fail to create a new product' },
      },
      edit: {
        method: 'put',
        apiUrl: `${apiBaseUrl}/api/${apiPath}/admin/product/${id}`,
        successMsg: { icon: 'success',
          title: 'Update product successfully' },
        errorMsg: { icon: 'error',
          title: 'Fail to update product' },
      },
    }

    const { method, apiUrl, successMsg, errorMsg } = modalConfig[modalType]

    try {
      // eslint-disable-next-line
      const res = await axios[method](
        apiUrl, productData,
      )
      await getProducts(false)
      Toast.fire(successMsg)

      // Clear upload file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      closeProductModal()
    }
    catch {
      Toast.fire(errorMsg)
    }
    finally {
      setIsProductsLoading(false)
    }
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
      setValue('imageUrl', res.data.imageUrl)
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
                      {templateProductData.title}
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
                            ref={fileInputRef}
                            className="form-control"
                            type="file"
                            name="file-to-upload"
                            id="file-to-upload"
                            accept=".jpg, .jpeg, .png"
                            onChange={e => uploadImg(e)}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="imageUrl" className="form-label">
                            輸入主圖網址
                          </label>
                          <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            className="form-control"
                            placeholder="請輸入圖片連結"
                            {...register('imageUrl')}
                          />
                          {errors.imageUrl && <span className="text-red">{errors.imageUrl.message}</span>}
                        </div>
                        {imageUrl && (
                          <img
                            className="img-fluid"
                            src={imageUrl}
                            alt="主圖"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div>
                        {fields.map(function (field, index) {
                          return (
                            <div key={field.id}>
                              <label htmlFor={`imagesUrl${index + 1}`} className="form-label">
                                輸入圖片網址
                                {index + 1}
                              </label>
                              <input
                                type="text"
                                id={`imagesUrl${index + 1}`}
                                className="form-control"
                                placeholder={`圖片網址${index + 1}`}
                                {...register(`imagesUrl.${index}.value`)}
                              />
                              {watch(`imagesUrl.${index}.value`)
                                && (
                                  <img
                                    className="img-fluid"
                                    src={watch(`imagesUrl.${index}.value`)}
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
                          onClick={() => append({ value: '' })}
                        >
                          新增圖片
                        </button>
                      </div>
                      <div>
                        <button
                          className="btn btn-danger btn-sm d-block w-100 mt-2"
                          onClick={() => fields.length > 0 && remove(fields.length - 1)}
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
                          {...register('title')}
                        />
                        {errors.title && <span className="text-red">{errors.title.message}</span>}
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
                            {...register('category')}
                          />
                          {errors.category && <span className="text-red">{errors.category.message}</span>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="unit" className="form-label">單位</label>
                          <input
                            name="unit"
                            id="unit"
                            type="text"
                            className="form-control"
                            placeholder="請輸入單位"
                            {...register('unit')}
                          />
                          {errors.unit && <span className="text-red">{errors.unit.message}</span>}
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
                            {...register('origin_price', { valueAsNumber: true })}
                          />
                          {errors.origin_price && <span className="text-red">{errors.origin_price.message}</span>}
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
                            {...register('price', { valueAsNumber: true })}
                          />
                          {errors.price && <span className="text-red">{errors.price.message}</span>}
                        </div>
                      </div>
                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label htmlFor="rate" className="form-label">商品評價 ( 0 非常不滿意～ 5 非常滿意）</label>
                          <input
                            name="rate"
                            id="rate"
                            type="number"
                            min="0"
                            max="5"
                            className="form-control"
                            placeholder="請輸入評分"
                            {...register('rate', {
                              setValueAs: (v) => {
                                if (v === '' || v === undefined || v === null) return undefined
                                const num = Number(v)
                                return Number.isNaN(num) ? undefined : num
                              },
                            })}
                          />
                          {errors.rate && <span className="text-red">{errors.rate.message}</span>}
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
                          {...register('description')}
                        >
                        </textarea>
                        {errors.description && <span className="text-red">{errors.description.message}</span>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="content" className="form-label">說明內容</label>
                        <textarea
                          name="content"
                          id="content"
                          className="form-control"
                          placeholder="請輸入說明內容"
                          {...register('content')}
                        >
                        </textarea>
                        {errors.content && <span className="text-red">{errors.content.message}</span>}
                      </div>
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            name="is_enabled"
                            id="is_enabled"
                            className="form-check-input"
                            type="checkbox"
                            {...register('is_enabled')}
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
                    onClick={handleSubmit(onSubmit)}
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
