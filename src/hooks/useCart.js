// src/hooks/useCart.js
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toast } from '../utils/toast'
import {
  fetchCart,
  addToCart as addToCartThunk,
  deleteCartItem as deleteCartItemThunk,
  deleteCartAll as deleteCartAllThunk,
  updateCartItem as updateCartItemThunk,
} from '../store/cartSlice'

const useCart = function () {
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart.data)
  const isLoading = useSelector(state => state.cart.status === 'loading')

  const getCart = useCallback(function () {
    dispatch(fetchCart())
  }, [dispatch]) // dispatch 是 stable ref，不會 re-trigger

  const addToCart = async function (productId, qty = 1) {
    try {
      await dispatch(addToCartThunk({ productId, qty })).unwrap()
      Toast.fire({ icon: 'success', title: 'Add to cart successfully' })
    }
    catch {
      Toast.fire({ icon: 'error', title: 'Fail to add the product into cart' })
    }
  }

  const deleteItem = async function (cartId) {
    try {
      await dispatch(deleteCartItemThunk(cartId)).unwrap()
      Toast.fire({ icon: 'success', title: 'Delete the product from cart list successfully' })
    }
    catch {
      Toast.fire({ icon: 'error', title: 'Fail to delete the product from cart list' })
    }
  }

  const clearCart = async function () {
    try {
      await dispatch(deleteCartAllThunk()).unwrap()
      Toast.fire({ icon: 'success', title: 'Clear the whole cart successfully' })
    }
    catch {
      Toast.fire({ icon: 'error', title: 'Fail to clear the whole cart list' })
    }
  }

  const updateItem = async function (cartId, productId, qty) {
    try {
      await dispatch(updateCartItemThunk({ cartId, productId, qty })).unwrap()
      Toast.fire({ icon: 'success', title: 'Update the product quantity in cart list successfully' })
    }
    catch {
      Toast.fire({ icon: 'error', title: 'Fail to update product quantity in cart list' })
    }
  }

  return {
    cart,
    isLoading,
    getCart,
    addToCart,
    deleteItem,
    clearCart,
    updateItem,
  }
}

export default useCart
