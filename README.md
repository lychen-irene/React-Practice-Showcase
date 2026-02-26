# React Practice Showcase

## Introduction

My React Practice Showcase based on homework given by hexschool React lessons.

- Showcase current structure:
## Directory Structure
```
src/
├── components/       # Reusable UI components
│   ├── AddNewProductBtn.jsx
│   ├── Declaration.jsx
│   ├── DefaultPage.jsx
│   ├── Footer.jsx
│   ├── LoginLoading.jsx
│   ├── Navbar.jsx          # Exports default Navbar + named `titles` array
│   ├── Pagination.jsx
│   ├── ProductDetail.jsx
│   ├── ProductEditHeader.jsx
│   ├── ProductHeader.jsx
│   ├── ProductModal.jsx    # Complex form modal (create/edit)
│   ├── ProductsLoading.jsx
│   └── SingleProduct.jsx   # Single product detail page (used as a route element)
├── layout/
│   ├── FrontendLayout.jsx  # Navbar + <Outlet /> + Footer
│   └── BackendLayout.jsx   # Navbar + <Outlet /> + Footer (admin shell)
├── view/
│   ├── front/              # Customer-facing pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Cart.jsx            # Cart page (stub — in progress)
│   │   ├── NotFound.jsx        # 404 catch-all page
│   │   ├── Product.jsx         # Product listing + add-to-cart
│   │   ├── ProjectOnePage.jsx  # Static product list (assignment 1)
│   │   └── Test.jsx            # Sandbox page for useNavigate experiments
│   └── back/               # Admin pages
│       ├── LoginForm.jsx
│       ├── ProjectTwoPage.jsx    # Auth + product list read-only (assignment 2)
│       ├── ProjectThirdPage.jsx  # Full CRUD (main admin, assignment 3)
│       └── ProjectFourthPage.jsx
├── assets/
│   ├── all.scss            # SCSS entry point
│   └── style/
│       ├── _customize.scss
│       ├── _loading.scss
│       ├── _variables.scss
│       └── _variables-dark.scss
├── App.jsx       # Root: Router + Suspense wrapper
├── router.jsx    # Route definitions (createHashRouter)
├── main.jsx      # Entry point
└── index.css     # Global CSS reset/base
```

    - latest modification date: 2026/2/27

## Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Framework     | React 19.2 + React Router 7.13 |
| Build Tool    | Vite 7.2                       |
| Styling       | SCSS + Bootstrap 5.3           |
| Form Handling | React Hook Form 7.71 + Zod 4.3 |
| HTTP Client   | Axios 1.13                     |
| Alerts/Toasts | SweetAlert2 11.26              |
| Linting       | ESLint 9.39 (flat config)      |
| Deployment    | GitHub Pages via `gh-pages`    |


## Installation Guide

- [Node.js package based on package-lock.json](https://docs.npmjs.com/cli/v8/commands/npm-install)

```
npm install
```

- Creating new [Vite](https://vite.dev/) project based on [React](https://react.dev/) Framework (framework is chosenable during installation)

```
npm create vite@latest
```

- [gh-pages deployment](https://www.npmjs.com/package/gh-pages)

```
npm install gh-pages
```

- [React Hook Form](https://react-hook-form.com/get-started)

```
npm install react-hook-form
```

- [React-Router](https://reactrouter.com/upgrading/v6#upgrade-to-v7)

```
npm install react-router@latest
```

- [Axios](https://axios-http.com/docs/intro)

```
npm install axios
```

- [Bootstrap](https://getbootstrap.com/)

```
npm install bootstrap
```

- [SweetAlert2](https://sweetalert2.github.io/#download)

```
npm install sweetalert2
```

- [React Hook Form Resolvers: Zod validation library](https://www.npmjs.com/package/@hookform/resolvers#zod)

```
npm install zod @hookform/resolvers
```

- [Rollup Plugin Visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

```
npm install --save-dev rollup-plugin-visualizer
```
