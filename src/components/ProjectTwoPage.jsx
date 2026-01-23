import { useEffect, useState, useCallback, useRef, React } from 'react'
import axios from 'axios'
import 'bootstrap' // loads Bootstrap's JavaScript plugins
import Swal from 'sweetalert2'

import Navbar, { titles } from './Navbar'
import Footer from './Footer'

// Login form page
const LoginForm = function ({ onSubmit, formData, onChange }) {
  return (
    <div className="container login">
      <h2>請先登入</h2>
      <form className="form-floating" onSubmit={onSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={onChange}
            required
            autoFocus
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button
          className="btn btn-lg btn-secondary w-20 mt-4"
          type="submit"
        >
          登入
        </button>
      </form>
    </div>
  )
}

// Login loading animation
const LoginLoading = function () {
  return (
    <div className="spinner-border m-5 text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

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

// Product thead
const ProductsThead = function () {
  return (
    <thead>
      <tr>
        <th>產品名稱</th>
        <th>原價</th>
        <th>售價</th>
        <th>是否啟用</th>
        <th>查看細節</th>
      </tr>
    </thead>
  )
}

// Products list table
// 第二層：負責單一 <tr> 的渲染
const ProductRow = function ({ product, onClick }) {
  return (
    <tr>
      <td className="align-middle">{product.title}</td>
      <td className="align-middle">{product.origin_price}</td>
      <td className="align-middle">{product.price}</td>
      <td className="align-middle">
        {product.is_enabled ? '已啟用' : '未啟用'}
      </td>
      <td className="align-middle">
        <button className="btn btn-primary" onClick={onClick}>
          查看細節
        </button>
      </td>
    </tr>
  )
}

// 第一層：負責 <tbody> + .map()
const ProductsList = function ({ products, onProductClick }) {
  return (
    <tbody>
      {products.map(product => (
        <ProductRow
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </tbody>
  )
}

// Product loading animation
const ProductsLoading = function () {
  return (
    <thead className="spinner-border m-5 text-light" role="status">
      <tr>
        <th className="visually-hidden">Loading...</th>
      </tr>
    </thead>
  )
}

// Single product detail
const ProductDetail = function ({ product }) {
  return (
    <div className="card border-secondary mb-3">
      {product.imageUrl && <img src={product.imageUrl} className="card-img-top primary-image" alt={product.title} referrerPolicy="no-referrer" />}
      <div className="card-body">
        <h5 className="card-title">
          {product.title}
          <span className="badge bg-secondary ms-2">{product.category}</span>
        </h5>
        <p className="card-text">
          商品描述：
          {product.description}
        </p>
        <p className="card-text">
          商品內容：
          {product.content}
        </p>
        <div className="d-flex">
          <p className="card-text text-secondary"><del>{product.origin_price}</del></p>
          元 /
          {product.price}
          元
        </div>
        <h5 className="mt-3">更多圖片：</h5>
        <div className="d-flex flex-wrap">
          {product.imagesUrl?.map((url, index) => {
            if (!url) return null
            return (
              <img key={index} src={url} className="card-img-top" alt={product.title} referrerPolicy="no-referrer" />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Main Content
const ProjectTwoPage = function () {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isAuth, setIsAuth] = useState(() => getToken())
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isProductsLoading, setIsProductsLoading] = useState(() => getToken())
  const [isChecking, setIsChecking] = useState(false)

  // Catch login form input content
  const handleInputChange = function (e) {
    const { name, value } = e.target
    setFormData(preData => ({
      ...preData,
      [name]: value }))
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
      setIsAuth(true)
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
      })
    }
    catch {
      setIsAuth(false)
      Toast.fire({
        icon: 'error',
        title: 'Failed to sign in',
      })
    }
    finally {
      setIsLoginLoading(false)
    }
  }

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
        if (showMsg) {
          Toast.fire({
            icon: 'success',
            title: 'Check success: token is valid',
          })
        }
      }
      else {
        setIsAuth(false)
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
        setIsAuth(false)
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
          setIsAuth(false)
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
        <Navbar>
          {titles.map(function (item) {
            return (
              <li className="nav-item" key={item.id}>
                {
                  item.title === 'About'
                    ? (
                        <a className="nav-link" aria-current="page" href={item.url}>
                          {item.title}
                        </a>
                      )
                    : (
                        <a className="nav-link" href={item.url}>
                          {item.title}
                        </a>
                      )
                }
              </li>
            )
          })}
        </Navbar>
        {isAuth
          ? (
              <div className="container-fluid">
                <div className="row mt-5 row-col-2">
                  <div className="col">
                    <CheckLoginButton onClick={checkLogin} isChecking={isChecking} />

                    <h2>產品列表</h2>
                    <p>
                      以下產品資料來源為
                      {/* rel="noopener noreferrer" for prevent phishing */}
                      {' '}
                      {/* space within text */}
                      <a href="https://www.stonexp.idv.tw/i.h?cls=40&pg=0,1" target="_blank" rel="noopener noreferrer">石探紀：茶包的礦物化石網站</a>
                      <br />
                      此列表僅供作業練習與面試使用，非商業性質用途
                    </p>
                    <table className="table table-dark table-striped table-bordered border-secondary">
                      {!isProductsLoading
                        ? (
                            <>
                              <ProductsThead />
                              <ProductsList products={products} onProductClick={setTempProduct} />
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
                          <ProductDetail product={tempProduct} />
                        )
                      : (
                          <p className="text-secondary">請選擇一個商品查看</p>
                        )}
                  </div>
                </div>
              </div>
            )
          : (

              <div className="d-flex justify-content-center">
                {!isLoginLoading
                  ? (
                      <LoginForm onSubmit={onSubmit} formData={formData} onChange={handleInputChange} />
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
