import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    count: (state) => state.items.length,
    
    isEmpty: (state) => state.items.length === 0,
    
    totalAmount: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },

    isInCart: (state) => {
      return (productId) => {
        return state.items.some(item => item.id === productId)
      }
    },
  },
  
  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.selectedOptions = product.selectedOptions

        existingItem.quantity += 1
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        })
      }
    },
    
    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    
    clearCart() {
      this.items = []
    },
    
    incrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity += 1
      }
    },
    
    decrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      } else if (item && item.quantity === 1) {
        this.removeItem(productId)
      }
    }
  },
  
  persist: {
    key: 'ecom-cart',
    storage: localStorage,
  },
})
