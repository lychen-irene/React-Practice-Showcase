import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

import axios from 'axios'
import 'bootstrap'

import { Toast } from '../utils/toast'

import ProductDetail from './ProductDetail'

function SingleProduct() {
  // API path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH

  const navigate = useNavigate()
  const { id } = useParams()
  const [singleProduct, setSingleProduct] = useState(null)

  useEffect(
    function () {
      async function getSingleProduct() {
        try {
          const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/product/${id}`)
          setSingleProduct(res.data.product)
        }
        catch (error) {
          if (error.response?.status === 404) {
            navigate('/not-found')
          }
          else {
            Toast.fire({
              icon: 'error',
              title: 'Fail to load product list',
            })
          }
        }
      }
      getSingleProduct()
    }, [apiBaseUrl, apiPath, id, navigate])

  return (
    <>
      <div>
        <h2>SingleProduct Page</h2>
      </div>
      <div className="container mt-3">
        <ProductDetail tempProduct={singleProduct} />
      </div>
    </>
  )
}

export default SingleProduct
