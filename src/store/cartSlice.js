import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

// --- Async Thunks ---

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async () => {
    const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/cart`)
    return res.data.data // { carts: [], final_total: 0 }
  },
)

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, qty = 1 }, { dispatch }) => {
    await axios.post(`${apiBaseUrl}/api/${apiPath}/cart`, {
      data: { product_id: productId, qty },
    })
    dispatch(fetchCart()) // 操作後同步最新狀態
  },
)

export const deleteCartItem = createAsyncThunk(
  'cart/deleteItem',
  async (cartId, { dispatch }) => {
    await axios.delete(`${apiBaseUrl}/api/${apiPath}/cart/${cartId}`)
    dispatch(fetchCart())
  },
)

export const deleteCartAll = createAsyncThunk(
  'cart/deleteAll',
  async (_, { dispatch }) => {
    await axios.delete(`${apiBaseUrl}/api/${apiPath}/carts`)
    dispatch(fetchCart())
  },
)

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartId, productId, qty }, { dispatch }) => {
    await axios.put(`${apiBaseUrl}/api/${apiPath}/cart/${cartId}`, {
      data: { product_id: productId, qty },
    })
    dispatch(fetchCart())
  },
)

// --- Slice ---

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    data: { carts: [], final_total: 0 },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {}, // 沒有同步 action，先留空
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default cartSlice.reducer
