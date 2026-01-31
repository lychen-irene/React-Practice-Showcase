import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import Swal from 'sweetalert2'

import Navbar, { titles } from '../Navbar'
import LoginForm from '../LoginForm'
import LoginLoading from '../LoginLoading'
import AddNewProductBtn from '../AddNewProductBtn'
import Declaration from '../Declaration'
import ProductEditHeader from '../ProductEditHeader'
import ProductModal, { ProductModelContent } from '../ProductModal'
import Pagination from '../Pagination'
import ProductsLoading from '../ProductsLoading'
import Footer from '../Footer'

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
    origin_price: null,
    price: null,
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: '',
    imagesUrl: [],
  } }

// Main Content
const ProjectThreePage = function () {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
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

  // Catch login form input content
  const handleLoginInputChange = function (e) {
    const { name, value } = e.target
    setFormData(function (preData) {
      return {
        ...preData,
        [name]: value,
      }
    })
  }

  // Action after clicking login button
  const onSubmit = async function (e) {
    try {
      e.preventDefault()
      setIsLoginLoading(true)
      const res = await axios.post(`${apiBaseUrl}/admin/signin`, formData)
      const { token, expired } = res.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`
      axios.defaults.headers.common['Authorization'] = token
      await getProducts(true)
      setAuthStatus('auth')
      Toast.fire({
        icon: 'success',
        title: 'Sign in successfully',
      })
    }
    catch {
      setAuthStatus('unauth')
      Toast.fire({
        icon: 'error',
        title: 'Fail to sign in',
      })
    }
    finally {
      setIsLoginLoading(false)
    }
  }

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

  // Create or update product info
  const updateProducts = async function (id, showLoading = true) {
    if (showLoading) setIsProductsLoading(true)

    const productData = {
      data: {
        ...templateProductData,
        origin_price: Number(templateProductData.origin_price),
        price: Number(templateProductData.price),
        imagesUrl: [...templateProductData.imagesUrl.filter(url => url !== '')],
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

  // Delete product
  const deleteProductData = async (id) => {
    try {
      // eslint-disable-next-line
      const res = await axios.delete(
        `${apiBaseUrl}/api/${apiPath}/admin/product/${id}`,
      )
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
      closeProductModal()
      getProducts(false)
    }
  }

  // Check token is valid or not
  const checkLogin = useCallback(
    async function (showMsg = true) {
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
          if (showMsg) {
            Toast.fire({
              icon: 'success',
              title: 'Check success: token is valid',
            })
          }
        }
        else {
          setAuthStatus('unauth')
          Toast.fire({
            icon: 'error',
            title: 'Check failed: token not found, please sign in again',
          })
        }
      }
      catch {
        setTimeout(function () {
          setAuthStatus('unauth')
        }, 0)
        if (showMsg) {
          Toast.fire({
            icon: 'error',
            title: 'Check failed: token is invalid',
          })
        }
      }
    },
    [apiBaseUrl, getProducts],
  )

  // Prevent checkLogin and SweetAlert popup run twice
  const hasChecked = useRef(false)
  useEffect(
    function () {
      if (!hasChecked.current) {
        hasChecked.current = true // prevent checkLogin run twice on strict mode
        setTimeout(function () {
          checkLogin(false) // SweetAlert will not be triggered because shwMsg = false
          // checkLogin() // SweetAlert always shows when pages is refreshed
        }, 0)
      }
    },
    [checkLogin],
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
    setTemplateProductData(function (preProductData) {
      return {
        ...preProductData,
        ...product,
      }
    })
    productModalRef.current.show()
  }

  // Close Modal
  const closeProductModal = function () {
    productModalRef.current.hide()
  }

  // Catch input content of edit type model
  const handleModalInputChange = function (e) {
    const { name, value, checked, type } = e.target
    setTemplateProductData(function (preProductData) {
      return {
        ...preProductData,
        [name]: type === 'checkbox' ? checked : value,
      }
    })
  }

  // Catch img input content of edit type model
  const handleModalImgChange = function (index, value) {
    setTemplateProductData(function (preProductData) {
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
    setTemplateProductData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.push('')
      return {
        ...preProductData,
        imagesUrl: newImg }
    })
  }

  // Delete existing image
  const handleDeleteImgChange = () => {
    setTemplateProductData(function (preProductData) {
      const newImg = [...preProductData.imagesUrl]
      newImg.pop()
      return { ...preProductData, imagesUrl: newImg }
    })
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
          <div className="container-fluid my-4">
            <div className="container">
              <div className="sticky-header py-2 my-4">
                <AddNewProductBtn
                  onClick={() => openProductModal('create', INITIAL_TEMPLATE_PRODUCT_DATA.data)}
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
        )}
        {authStatus === 'unauth' && (
          <div className="d-flex justify-content-center">
            {!isLoginLoading
              ? (
                  <LoginForm
                    onSubmit={onSubmit}
                    formData={formData}
                    onChange={handleLoginInputChange}
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
          onClick={closeProductModal}
          templateProductData={templateProductData}
          onChange={handleModalInputChange}
          onImgChange={handleModalImgChange}
          onClickAddImg={handleAddImgChange}
          onClickDeleteImg={handleDeleteImgChange}
          updateProducts={updateProducts}
          deleteProductData={deleteProductData}
          ProductModelContent={ProductModelContent}
        />

        <Pagination
          pagination={pagination}
          onChange={page => getProducts(true, page)}
        />

        <Footer />
      </div>
    </>
  )
}

export default ProjectThreePage
