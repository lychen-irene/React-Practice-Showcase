const LoginForm = function ({ onSubmit, formData, onChange }) {
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
    </>
  )
}

export default LoginForm
