import isEqual from 'lodash/isEqual';
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    count: (state) => state.items.length,
    
    isEmpty: (state) => state.items.length === 0,
    
    totalAmount: (state) => {
      return state.items.reduce((total, item) => {
        // Calculate base price
        let itemPrice = item.price || 0
        
        // Add price from selected options
        if (item.selectedOptions) {
          for (const optionName in item.selectedOptions) {
            const selectedOption = item.selectedOptions[optionName]
            if (selectedOption && selectedOption.price_added) {
              itemPrice += selectedOption.price_added
            }
          }
        }
        
        return total + (itemPrice * item.quantity)
      }, 0)
    },

    isInCart: (state) => {
      return (productId, selectedOptions = {}) => {
        return state.items.some(item => {
          const sameProduct = item.id === productId
          const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
          return sameProduct && sameOptions
        })
      }
    },

    getProductQuantity: (state) => {
      return (productId, selectedOptions = {}) => {
        const item = state.items.find(item => {
          const sameProduct = item.id === productId
          const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
          return sameProduct && sameOptions
        })
        return item ? item.quantity : 0
      }
    },
  },
  
  actions: {
    addItem(product) {
      console.log('Cart: Adding product', product.id, 'with options:', product.selectedOptions);
      
      // Find existing item with same product ID AND same selected options
      const existingItem = this.items.find(item => {
        const sameProduct = item.id === product.id
        const sameOptions = isEqual(item.selectedOptions || {}, product.selectedOptions || {})
        return sameProduct && sameOptions
      })
      
      if (existingItem) {
        console.log('Cart: Found existing item, incrementing quantity');
        existingItem.quantity += (product.quantity || 1)
      } else {
        console.log('Cart: Adding new item');
        this.items.push({
          ...product,
          quantity: product.quantity || 1,
          selectedOptions: product.selectedOptions || {},
        })
      }
      
      console.log('Cart: Total items now:', this.items.length);
    },
    
    removeItem(productId, selectedOptions = {}) {
      const index = this.items.findIndex(item => {
        const sameProduct = item.id === productId
        const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
        return sameProduct && sameOptions
      })
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    
    updateQuantity(productId, quantity, selectedOptions = {}) {
      const item = this.items.find(item => {
        const sameProduct = item.id === productId
        const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
        return sameProduct && sameOptions
      })
      if (item) {
        item.quantity = quantity
      }
    },
    
    clearCart() {
      this.items = []
    },
    
    incrementQuantity(productId, selectedOptions = {}) {
      const item = this.items.find(item => {
        const sameProduct = item.id === productId
        const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
        return sameProduct && sameOptions
      })
      if (item) {
        item.quantity += 1
      }
    },
    
    decrementQuantity(productId, selectedOptions = {}) {
      const item = this.items.find(item => {
        const sameProduct = item.id === productId
        const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
        return sameProduct && sameOptions
      })
      if (item && item.quantity > 1) {
        item.quantity -= 1
      } else if (item && item.quantity === 1) {
        this.removeItem(productId, selectedOptions)
      }
    }
  },
  
  persist: {
    key: 'ecom-cart',
    storage: localStorage,
  },
})
