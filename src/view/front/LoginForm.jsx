import { useState } from 'react'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const LoginForm = function ({
  Toast,
  getProducts,
  setAuthStatus,
  setIsLoginLoading }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

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

  return (
    <>
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
              onChange={handleLoginInputChange}
              required
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
              onChange={handleLoginInputChange}
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
    </>
  )
}

export default LoginForm
