// Test script to understand the option selection priority issue

// Mock product data based on what we see in the issue
const mockProduct = {
  id: 1,
  product_options: [
    {
      name: "Size",
      items: [
        { name: "S", stock_quantity: 0 },
        { name: "M", stock_quantity: 2 },
        { name: "L", stock_quantity: 0 },
        { name: "XL", stock_quantity: "" }  // This might be the issue
      ]
    },
    {
      name: "Color", 
      items: [
        { name: "Red", stock_quantity: 5 },
        { name: "Blue", stock_quantity: null },
        { name: "Green", stock_quantity: 0 }
      ]
    }
  ]
};

// Test the priority logic
function testOptionPriority(option) {
  console.log(`\nTesting option: ${option.name}`);
  console.log('Items:', option.items);
  
  // Priority 1: Find option with stock quantity > 0
  const availableOption = option.items.find(
    (item) => item.stock_quantity > 0
  );
  console.log('Available option (stock > 0):', availableOption);

  // Priority 2: Find option with unlimited stock (null or empty string)
  const unlimitedStockOption = option.items.find(
    (item) => item.stock_quantity === null || item.stock_quantity === ""
  );
  console.log('Unlimited stock option (null or ""):', unlimitedStockOption);

  // Select in order of priority
  const selected = availableOption || unlimitedStockOption || option.items[0];
  console.log('Selected option:', selected);
  
  return selected;
}

// Test both options
mockProduct.product_options.forEach(option => {
  testOptionPriority(option);
});

console.log('\n=== Expected Results ===');
console.log('Size should select: M (stock: 2)');
console.log('Color should select: Red (stock: 5)');
