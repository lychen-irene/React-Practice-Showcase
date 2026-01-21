import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import Navbar, { titles } from './Navbar'
import Footer from './Footer'

const ProjectTwoPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH
  const [formData, setFormData] = useState({
    username: 'chenliangyu09@gmail.com',
    password: 'hexschoolau4a83',
  })
  const [isAuth, setIsAuth] = useState(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('hexToken='))
      ?.split('=')[1]
    return !!token
  })
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)

  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/admin/products`)
      setProducts(res.data.products)
    }
    catch {
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
      Toast.fire({
        icon: 'error',
        title: 'Failed to load product list',
      })
    }
  }, [apiBaseUrl, apiPath])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(preData => ({
      ...preData,
      [name]: value }))
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      const res = await axios.post(`${apiBaseUrl}/admin/signin`, formData)
      const { token, expired } = res.data
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`
      axios.defaults.headers.common['Authorization'] = token
      getProducts()
      setIsAuth(true)
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
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
      })
    }
    catch {
      setIsAuth(false)
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
      Toast.fire({
        icon: 'error',
        title: 'Failed to sign in',
      })
    }
  }

  const checkLogin = useCallback(async (showMsg = true) => {
    try {
      // 從 Cookie 取得 Token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hexToken='))
        ?.split('=')[1]

      if (token) {
        axios.defaults.headers.common['Authorization'] = token
        // 驗證 Token 是否有效
        // eslint-disable-next-line
        const res = await axios.post(`${apiBaseUrl}/api/user/check`)
        getProducts()
        if (showMsg) {
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
          Toast.fire({
            icon: 'success',
            title: 'Check success: token is valid',
          })
        }
      }
    }
    catch {
      setTimeout(() => setIsAuth(false), 0)
      if (showMsg) {
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
        Toast.fire({
          icon: 'error',
          title: 'Check failed: token is invalid',
        })
      }
    }
  }, [apiBaseUrl, getProducts])

  const hasChecked = useRef(false)
  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true // prevent checkLogin run twice on strict mode
      setTimeout(() => {
        checkLogin(false) // SweetAlert will not be triggered because shwMsg = false
        // checkLogin() // SweetAlert always shows when pages is refreshed
      }, 0)
    }
  }, [checkLogin])

  return (
    <>
      <div>
        <Navbar>
          {titles.map((item) => {
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
                    <button className="btn btn-secondary mb-5" type="button" onClick={checkLogin}>
                      確認登入狀態
                    </button>

                    <h2>產品列表</h2>
                    <p>
                      以下產品資料來源為
                      {' '}
                      {/* rel="noopener noreferrer" for prevent phishing */}
                      <a href="https://www.stonexp.idv.tw/i.h?cls=40&pg=0,1" target="_blank" rel="noopener noreferrer">石探紀：茶包的礦物化石網站</a>
                      {' '}
                      <br />
                      此列表僅供作業練習與面試使用，非商業性質用途
                    </p>
                    <table className="table table-dark table-striped table-bordered border-secondary">
                      <thead className="">
                        <tr>
                          <th>產品名稱</th>
                          <th>原價</th>
                          <th>售價</th>
                          <th>是否啟用</th>
                          <th>查看細節</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(products => (
                          <tr key={products.id}>
                            <td className="align-middle">{products.title}</td>
                            <td className="align-middle">{products.origin_price}</td>
                            <td className="align-middle">{products.price}</td>
                            <td className="align-middle">
                              {products.is_enabled ? '已啟用' : '未啟用'}
                            </td>
                            <td className="align-middle">
                              <button className="btn btn-primary" onClick={() => setTempProduct(products)}>查看細節</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="col">
                    <h2>單一產品細節</h2>
                    {tempProduct
                      ? (
                          <div className="card border-secondary mb-3">
                            {tempProduct.imageUrl && <img src={tempProduct.imageUrl} className="card-img-top primary-image" alt={tempProduct.title} referrerPolicy="no-referrer" />}
                            <div className="card-body">
                              <h5 className="card-title">
                                {tempProduct.title}
                                <span className="badge bg-secondary ms-2">{tempProduct.category}</span>
                              </h5>
                              <p className="card-text">
                                商品描述：
                                {tempProduct.description}
                              </p>
                              <p className="card-text">
                                商品內容：
                                {tempProduct.content}
                              </p>
                              <div className="d-flex">
                                <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
                                元 /
                                {' '}
                                {tempProduct.price}
                                {' '}
                                元
                              </div>
                              <h5 className="mt-3">更多圖片：</h5>
                              <div className="d-flex flex-wrap">
                                {tempProduct.imagesUrl?.map((url, index) => {
                                  if (!url) return null
                                  return (
                                    <img key={index} src={url} className="card-img-top" alt={tempProduct.title} referrerPolicy="no-referrer" />
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      : (
                          <p className="text-secondary">請選擇一個商品查看</p>
                        )}
                  </div>
                </div>
              </div>
            )
          : (
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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

            )}
        <Footer />
      </div>
    </>
  )
}

export default ProjectTwoPage
