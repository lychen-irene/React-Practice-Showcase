import { ColorRing } from 'react-loader-spinner'

const ProductsLoading = function () {
  return (

    <>
      <thead className="bg-transparent border-0">
        <tr className="bg-transparent border-0">
          <td
            colSpan="100"
            className="text-center bg-transparent border-0 py-4"
          >
            <ColorRing
              height="45"
              width="45"
              colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
              ariaLabel="loading"
            />
          </td>
        </tr>
      </thead>
    </>
  )
}

export default ProductsLoading
