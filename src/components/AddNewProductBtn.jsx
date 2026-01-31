const AddNewProductBtn = function ({ onClick }) {
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

export default AddNewProductBtn
