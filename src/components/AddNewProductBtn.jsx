const AddNewProductBtn = function ({
  openProductModal,
  INITIAL_TEMPLATE_PRODUCT_DATA }) {
  return (
    <div className="text-end mt-4">
      <button
        className="btn btn-primary mb-5"
        type="button"
        onClick={() => openProductModal('create', INITIAL_TEMPLATE_PRODUCT_DATA.data)}
      >
        建立新的產品
      </button>
    </div>
  )
}

export default AddNewProductBtn
