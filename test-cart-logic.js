// Simple test script to verify cart logic

// Simple isEqual implementation for testing
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Mock cart store implementation
class MockCartStore {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    // Find existing item with same product ID AND same selected options
    const existingItem = this.items.find(item => {
      const sameProduct = item.id === product.id
      const sameOptions = isEqual(item.selectedOptions || {}, product.selectedOptions || {})
      return sameProduct && sameOptions
    })
    
    if (existingItem) {
      // Same product with same options - increment quantity
      existingItem.quantity += (product.quantity || 1)
    } else {
      // Different product or different options - add as new item
      this.items.push({
        ...product,
        quantity: product.quantity || 1,
        selectedOptions: product.selectedOptions || {},
      })
    }
  }

  removeItem(productId, selectedOptions = {}) {
    const index = this.items.findIndex(item => {
      const sameProduct = item.id === productId
      const sameOptions = isEqual(item.selectedOptions || {}, selectedOptions)
      return sameProduct && sameOptions
    })
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}

// Test cases
const cart = new MockCartStore();

console.log('=== Testing Cart Logic ===');

// Test 1: Add same product with no options
const product1 = {
  id: 2,
  name: "T-Shirt",
  price: 2900,
  selectedOptions: {}
};

cart.addItem(product1);
console.log('After adding product with no options:', cart.items.length, 'items');
console.log('Item:', cart.items[0]);

// Test 2: Add same product again with no options (should increment quantity)
cart.addItem(product1);
console.log('After adding same product again:', cart.items.length, 'items');
console.log('Quantity:', cart.items[0].quantity);

// Test 3: Add same product with different options (should create new item)
const product2 = {
  id: 2,
  name: "T-Shirt",
  price: 2900,
  selectedOptions: {
    Size: {
      name: "M",
      price_added: 0
    }
  }
};

cart.addItem(product2);
console.log('After adding product with Size M:', cart.items.length, 'items');
console.log('Items:', cart.items.map(item => ({ 
  id: item.id, 
  quantity: item.quantity, 
  options: Object.keys(item.selectedOptions) 
})));

// Test 4: Add same product with same options (should increment quantity of variant)
cart.addItem(product2);
console.log('After adding Size M again:', cart.items.length, 'items');
console.log('Items:', cart.items.map(item => ({ 
  id: item.id, 
  quantity: item.quantity, 
  options: Object.keys(item.selectedOptions) 
})));

// Test 5: Add same product with different option value
const product3 = {
  id: 2,
  name: "T-Shirt",
  price: 2900,
  selectedOptions: {
    Size: {
      name: "L",
      price_added: 0
    }
  }
};

cart.addItem(product3);
console.log('After adding product with Size L:', cart.items.length, 'items');
console.log('Items:', cart.items.map(item => ({ 
  id: item.id, 
  quantity: item.quantity, 
  options: item.selectedOptions 
})));

console.log('\n=== Test Results ===');
console.log('Total items in cart:', cart.items.length);
console.log('Expected: 3 items (no options, Size M, Size L)');
console.log('✅ Test passed:', cart.items.length === 3 ? 'YES' : 'NO');
