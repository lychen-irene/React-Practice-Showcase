import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { Toast } from '../../utils/toast'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
function setAuthToken(token, expired) {
  document.cookie = `hexToken=${token};expires=${new Date(expired)};`
  axios.defaults.headers.common['Authorization'] = token
}

const LoginPage = function () {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Action after clicking login button
  const onSubmit = async function (formData) {
    try {
      const res = await axios.post(`${apiBaseUrl}/admin/signin`, formData)
      const { token, expired } = res.data
      setAuthToken(token, expired)
      reset()
      navigate('/admin/products', { replace: true })
      Toast.fire({
        icon: 'success',
        title: 'Sign in successfully',
      })
    }
    catch {
      Toast.fire({
        icon: 'error',
        title: 'Fail to sign in',
      })
    }
  }

  return (
    <>
      <div className="container login">
        <h2>請先登入</h2>
        <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              placeholder="name@example.com"
              {...register('username',
                { required: '請輸入帳號 Email',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email 格式不正確',
                  },
                })}
            />
            <label htmlFor="username">Email address</label>
            {errors.username && (
              <p className="text-warning fw-bold">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              {...register('password',
                { required: '請輸入密碼',
                  minlength: {
                    value: 6,
                    message: '密碼至少要6碼',
                  },
                })}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <p className="text-warning fw-bold">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            className="btn btn-lg btn-primary w-20 mt-4"
            type="submit"
          >
            登入
          </button>
        </form>
      </div>
    </>
  )
}

export default LoginPage
