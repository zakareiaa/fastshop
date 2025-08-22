// Test the checkout stock validation logic

// Mock cart item with product options
const mockCartItem = {
  id: 1,
  name: "Test Product",
  quantity: 2,
  product_options: [
    {
      name: "Size",
      items: [
        { name: "S", stock_quantity: 0 },
        { name: "M", stock_quantity: 2 },
        { name: "L", stock_quantity: 0 },
        { name: "XL", stock_quantity: "" }
      ]
    },
    {
      name: "Color",
      items: [
        { name: "Black", stock_quantity: 0 },
        { name: "White", stock_quantity: null }
      ]
    }
  ],
  selectedOptions: {
    Size: { name: "M", stock_quantity: 2 },
    Color: { name: "White", stock_quantity: null }
  }
};

// Test the getItemStockLimit logic
function getItemStockLimit(item) {
  // If no product options, no stock limit
  if (!item.product_options || item.product_options.length === 0) {
    return null;
  }

  let minStock = Infinity;
  let hasValidStock = false;
  let hasUnlimitedStock = false;

  // Check stock for all selected options in this item
  if (item.selectedOptions) {
    for (const optionName in item.selectedOptions) {
      const selectedOption = item.selectedOptions[optionName];
      if (selectedOption) {
        // Check if stock is unlimited (null or empty string)
        if (selectedOption.stock_quantity === null || selectedOption.stock_quantity === "") {
          hasUnlimitedStock = true;
        } else {
          const stock = parseInt(selectedOption.stock_quantity) || 0;
          minStock = Math.min(minStock, stock);
          hasValidStock = true;
        }
      }
    }
  }

  // If any option has unlimited stock, return null (unlimited)
  if (hasUnlimitedStock && !hasValidStock) {
    return null;
  }

  // If we have both limited and unlimited stock, return the limited stock
  return hasValidStock ? minStock : null;
}

console.log("Testing cart item stock limit:");
console.log("Cart item:", mockCartItem);
console.log("Current quantity:", mockCartItem.quantity);
console.log("Stock limit:", getItemStockLimit(mockCartItem));

// Test different scenarios
const testCases = [
  {
    name: "Limited stock only",
    selectedOptions: {
      Size: { name: "M", stock_quantity: 2 }
    },
    expected: 2
  },
  {
    name: "Unlimited stock only", 
    selectedOptions: {
      Color: { name: "White", stock_quantity: null }
    },
    expected: null
  },
  {
    name: "Mixed stock (should return limited)",
    selectedOptions: {
      Size: { name: "M", stock_quantity: 2 },
      Color: { name: "White", stock_quantity: null }
    },
    expected: 2
  },
  {
    name: "No stock available",
    selectedOptions: {
      Size: { name: "S", stock_quantity: 0 }
    },
    expected: 0
  }
];

console.log("\nTesting different scenarios:");
testCases.forEach(testCase => {
  const mockItem = { ...mockCartItem, selectedOptions: testCase.selectedOptions };
  const result = getItemStockLimit(mockItem);
  console.log(`${testCase.name}: Expected ${testCase.expected}, Got ${result}`);
});
