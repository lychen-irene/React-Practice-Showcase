import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import Swal from 'sweetalert2'

import Navbar, { titles } from '../../components/Navbar'
import LoginForm from './LoginForm'
import LoginLoading from '../../components/LoginLoading'
import AddNewProductBtn from '../../components/AddNewProductBtn'
import Declaration from '../../components/Declaration'
import ProductEditHeader from '../../components/ProductEditHeader'
import ProductModal, { ProductModelContent } from '../../components/ProductModal'
import Pagination from '../../components/Pagination'
import ProductsLoading from '../../components/ProductsLoading'
import Footer from '../../components/Footer'

// Get login token from cookie
const getToken = function () {
  return document.cookie
    .split('; ')
    .find(function (row) {
      return (row.startsWith('hexToken='))
    })
    ?.split('=')[1]
}
// const function statement only due to document.cookie changes over time (e.g., after login)

// SweetAlert popup type
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: function (toast) {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

// Product api post format
const INITIAL_TEMPLATE_PRODUCT_DATA = {
  data:
  { id: '',
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: '',
    imagesUrl: [],
    rate: '',
  } }

// Main Content
const ProjectThirdPage = function () {
  // API path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [authStatus, setAuthStatus] = useState(function () {
    return (getToken() ? 'loading' : 'unauth')
  },
  )
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [templateProductData, setTemplateProductData] = useState(INITIAL_TEMPLATE_PRODUCT_DATA.data)
  const [modalType, setModalType] = useState('')

  // Get all products info from API
  const getProducts = useCallback(
    async function (showLoading = true, page = 1) {
      if (showLoading) setIsProductsLoading(true)
      try {
        const res = await axios.get(
          `${apiBaseUrl}/api/${apiPath}/admin/products?page=${page}`,
        )
        // store pages info
        setProducts(res.data.products)
        setPagination(res.data.pagination)
      }
      catch {
        Toast.fire({
          icon: 'error',
          title: 'Fail to load product list',
        })
      }
      finally {
        setIsProductsLoading(false)
      }
    },
    [apiBaseUrl, apiPath],
  )

  // Check token is valid or not
  const checkLogin = useCallback(
    async function () {
      try {
        // Get token from Cookie
        const token = getToken()
        if (token) {
          axios.defaults.headers.common['Authorization'] = token
          // check token is valid or not
          // eslint-disable-next-line
          const res = await axios.post(`${apiBaseUrl}/api/user/check`);
          await getProducts(false)
          setAuthStatus('auth')
        }
      }
      catch {
        setTimeout(function () {
          setAuthStatus('unauth')
        }, 0)
      }
    },
    [apiBaseUrl, getProducts],
  )

  // Prevent checkLogin and SweetAlert popup run twice
  const hasChecked = useRef(false)
  useEffect(
    function () {
      // Only check token if initial state is 'loading' (meaning token exists)
      // Skip if already 'unauth' (no token from the start)
      if (!hasChecked.current && authStatus === 'loading') // prevent checkLogin run twice on strict mode
        setTimeout(function () {
          checkLogin()
        }, 0)
    },
    [checkLogin, authStatus],
  )

  // Auto logout when other 401 error comes out
  useEffect(function () {
    // sign up interceptor
    const interceptor = axios.interceptors.response.use(
      function (response) { return (response) },
      function (error) {
        if (error.response?.status === 401) {
          // delete cookie by setting expired time into past time
          document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
          setAuthStatus('unauth')
          Toast.fire({
            icon: 'error',
            title: 'Token is invalid, please sign in again',
          })
        }
        return Promise.reject(error)
      },
    )

    // clear interceptor when unmounting
    return function () {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  // Prevent Modal being reset
  const productModalRef = useRef(null)
  useEffect(function () {
    if (authStatus === 'auth') {
      productModalRef.current = new bootstrap.Modal('#productModal', {
        keyboard: false,
      },
      )
      document
        .querySelector('#productModal')
        .addEventListener('hide.bs.modal', () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
        })
    }
  }, [authStatus])

  // Open specific type of Modal
  const openProductModal = function (type, product) {
    setModalType(type)
    setTemplateProductData(function () {
      return {
        ...INITIAL_TEMPLATE_PRODUCT_DATA.data,
        ...product,
      }
    })
    productModalRef.current.show()
  }

  // Close Modal
  const closeProductModal = function () {
    productModalRef.current.hide()
  }

  return (
    <>
      <div>
        <Navbar title={{ titles }} />
        {authStatus === 'loading' && (
          <div className="d-flex justify-content-center">
            <LoginLoading />
          </div>
        )}
        {authStatus === 'auth' && (
          <>
            <div className="container-fluid my-4">
              <div className="container">
                <div className="sticky-header py-2 my-4">
                  <AddNewProductBtn
                    openProductModal={openProductModal}
                    INITIAL_TEMPLATE_PRODUCT_DATA={INITIAL_TEMPLATE_PRODUCT_DATA}
                  />
                  <Declaration />
                </div>
                <div className="table">
                  <table className="table table-dark table-striped table-bordered border-secondary">
                    {!isProductsLoading
                      ? (
                          <>
                            <ProductEditHeader products={products} openProductModal={openProductModal} />

                          </>
                        )
                      : (
                          <ProductsLoading />
                        )}
                  </table>
                </div>
              </div>
            </div>
            <Pagination
              pagination={pagination}
              onChange={page => getProducts(true, page)}
            />
          </>
        )}
        {authStatus === 'unauth' && (
          <div className="d-flex justify-content-center">
            {!isLoginLoading
              ? (
                  <LoginForm
                    Toast={Toast}
                    getProducts={getProducts}
                    setAuthStatus={setAuthStatus}
                    setIsLoginLoading={setIsLoginLoading}
                  />
                )
              : (
                  <LoginLoading />
                )}
          </div>
        )}
        <ProductModal
          modalType={modalType}
          ref={productModalRef}
          templateProductData={templateProductData}
          setTemplateProductData={setTemplateProductData}
          closeProductModal={closeProductModal}
          ProductModelContent={ProductModelContent}
          setIsProductsLoading={setIsProductsLoading}
          getProducts={getProducts}
          Toast={Toast}
        />
        <Footer />
      </div>
    </>
  )
}

export default ProjectThirdPage
