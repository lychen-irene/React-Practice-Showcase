import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import 'bootstrap' // loads Bootstrap's JavaScript plugins
import Swal from 'sweetalert2'

import Navbar, { titles } from '../../components/Navbar'
import LoginForm from '../../view/back/LoginForm'
import LoginLoading from '../../components/LoginLoading'
import Declaration from '../../components/Declaration'
import ProductHeader from '../../components/ProductHeader'
import ProductDetail from '../../components/ProductDetail'
import ProductsLoading from '../../components/ProductsLoading'
import Footer from '../../components/Footer'

// Get login token from cookie
const getToken = function () {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('hexToken='))
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
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

// Check login status button
const CheckLoginButton = function ({ onClick, isChecking }) {
  return (
    <button className="btn btn-secondary mb-5" type="button" onClick={onClick} disabled={isChecking}>
      {isChecking && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
      確認登入狀態
    </button>
  )
}

// Main Content
const ProjectTwoPage = function () {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [authStatus, setAuthStatus] = useState(() => getToken() ? 'loading' : 'unauth')
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Get all products info from API
  const getProducts = useCallback(async function (showLoading = true) {
    if (showLoading) setIsProductsLoading(true)
    try {
      const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/admin/products`)
      setProducts(res.data.products)
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Failed to load product list',
      })
    }
    finally {
      setIsProductsLoading(false)
    }
  }, [apiBaseUrl, apiPath])

  // Check token is valid or not by checkLogin buttun
  const checkLogin = useCallback(async function (showMsg = true) {
    if (showMsg) setIsChecking(true)
    try {
      // 從 Cookie 取得 Token
      const token = getToken()

      if (token) {
        axios.defaults.headers.common['Authorization'] = token
        // 驗證 Token 是否有效
        // eslint-disable-next-line
        const res = await axios.post(`${apiBaseUrl}/api/user/check`)
        await getProducts(false) // 靜默更新，不觸發產品 loading
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
        if (showMsg) {
          Toast.fire({
            icon: 'error',
            title: 'Check failed: token not found, please sign in again',
          })
        }
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
    finally {
      if (showMsg) setIsChecking(false)
    }
  }, [apiBaseUrl, getProducts])

  // Prevent checkLogin and SweetAlert popup run twice
  const hasChecked = useRef(false)
  useEffect(function () {
    if (!hasChecked.current) {
      hasChecked.current = true // prevent checkLogin run twice on strict mode
      setTimeout(() => {
        checkLogin(false) // SweetAlert will not be triggered because shwMsg = false
        // checkLogin() // SweetAlert always shows when pages is refreshed
      }, 0)
    }
  }, [checkLogin])

  // Auto logout when other 401 error comes out
  useEffect(() => {
    // 註冊 interceptor
    const interceptor = axios.interceptors.response.use(
      response => response,
      (error) => {
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

    // 清除 interceptor（元件卸載時）
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

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
          <div className="container-fluid">
            <div className="row mt-5 row-col-2">
              <div className="col">
                <CheckLoginButton onClick={checkLogin} isChecking={isChecking} />

                <Declaration />
                <table className="table table-dark table-striped table-bordered border-secondary">
                  {!isProductsLoading
                    ? (
                        <>
                          <ProductHeader products={products} setTempProduct={setTempProduct} />
                        </>
                      )
                    : (
                        <ProductsLoading />
                      )}
                </table>
              </div>
              <div className="col">
                <h2>單一產品細節</h2>
                {tempProduct
                  ? (
                      <ProductDetail tempProduct={tempProduct} />
                    )
                  : (
                      <p className="text-secondary">請選擇一個商品查看</p>
                    )}
              </div>
            </div>
          </div>
        )}
        {authStatus === 'unauth' && (
          <div className="d-flex justify-content-center">
            {!isLoginLoading
              ? (
                  <LoginForm
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
        <Footer />
      </div>
    </>
  )
}

export default ProjectTwoPage
