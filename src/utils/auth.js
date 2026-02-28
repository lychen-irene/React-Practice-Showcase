// src/utils/auth.js
export const getToken = () =>
  document.cookie
    .split('; ')
    .find(row => row.startsWith('hexToken='))
    ?.split('=')[1]
