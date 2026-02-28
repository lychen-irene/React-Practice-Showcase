import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import axios from 'axios'
import 'bootstrap'

import { Toast } from '../../utils/toast'
import Declaration from '../../components/Declaration'

function Product() {
  // API path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH

  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const addCart = async (id, num = 1) => {
    const data = {
      product_id: id,
      qty: num,
    }
    try {
      const url = `${apiBaseUrl}/api/${apiPath}/cart`
      await axios.post(url, { data })
      Toast.fire({
        icon: 'success',
        title: 'Add to cart successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to add the product into cart',
      })
    }
  }

  const handleView = async function (id) {
    try {
      navigate(`/product/${id}`)
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to load single product',
      })
    }
  }

  useEffect(
    function () {
      async function getProducts() {
        try {
          const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/products/all`)
          setProducts(res.data.products)
        }
        catch {
          Toast.fire({
            icon: 'error',
            title: 'Fail to load product list',
          })
        }
      }
      getProducts()
    }, [apiBaseUrl, apiPath])

  return (
    <>
      <div className="my-5">
        <Declaration />
        <div className="container">

          <div className="row">
            {
              products.map(product => (
                <div className="col-md-4 mb-3" key={product.id}>
                  <div className="card">
                    <img src={product.imageUrl} className="card-img-top" alt={product.title} referrerPolicy="no-referrer" />
                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text">{product.description}</p>
                      <div className="d-flex">
                        <p className="card-text text-secondary">
                          <del>
                            {product.origin_price}
                            元
                          </del>
                        </p>
                        <p>
                          <span style={{ whiteSpace: 'pre' }}>
                            {' '}
                            {product.price}
                            {' '}
                            元
                            {' '}
                            <small className="text">
                              /
                              {product.unit}
                            </small>
                          </span>
                        </p>
                      </div>
                      <div className="d-flex gap-4">
                        <div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => { handleView(product.id) }}
                          >
                            查看更多
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => { addCart(product.id) }}
                          >
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
