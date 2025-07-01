import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    count: (state) => state.items.length,
    
    isEmpty: (state) => state.items.length === 0,
    
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    },
  },
  
  actions: {
    addItem(product) {
      if (!this.isInWishlist(product.id)) {
        this.items.push(product)
      }
    },
    
    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    
    toggleItem(product) {
      if (this.isInWishlist(product.id)) {
        this.removeItem(product.id)
        return false
      } else {
        this.addItem(product)
        return true
      }
    },
    
    clearWishlist() {
      this.items = []
    },
    
    moveToCart(productId, cartStore) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        cartStore.addItem(item)
        this.removeItem(productId)
      }
    },
    
    moveAllToCart(cartStore) {
      this.items.forEach(item => {
        cartStore.addItem(item)
      })
      this.clearWishlist()
    }
  },
  
  persist: {
    key: 'ecom-wishlist',
    storage: localStorage,
  },
})
