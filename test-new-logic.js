// Test script to verify the updated option selection logic

// Test with the actual product data structure
const mockProduct = {
  id: 1,
  product_options: [
    {
      name: "Size",
      items: [
        { name: "S", stock_quantity: 0 },     // No stock
        { name: "M", stock_quantity: 2 },     // Has stock (should be selected)
        { name: "L", stock_quantity: 0 },     // No stock
        { name: "XL", stock_quantity: "" }    // Unlimited stock (also considered available)
      ]
    },
    {
      name: "Color", 
      items: [
        { name: "Black", stock_quantity: 0 },     // No stock
        { name: "White", stock_quantity: null }   // Unlimited stock (should be selected)
      ]
    },
    {
      name: "Material",
      items: [
        { name: "Cotton", stock_quantity: 0 },    // No stock  
        { name: "Silk", stock_quantity: 0 },      // No stock
        { name: "Linen", stock_quantity: 0 }      // No stock (should fallback to first)
      ]
    }
  ]
};

function testNewOptionSelection(option) {
  console.log(`\n=== Testing option: ${option.name} ===`);
  console.log('Items:', option.items);
  
  // New logic: Find first option with available stock (stock > 0 OR unlimited)
  const availableOption = option.items.find((item) => {
    // Check if stock is unlimited (null or empty string)
    const isUnlimited = item.stock_quantity === null || item.stock_quantity === "";
    
    // Check if stock quantity > 0
    const stockQty = parseInt(item.stock_quantity);
    const hasLimitedStock = !isNaN(stockQty) && stockQty > 0;
    
    const hasStock = isUnlimited || hasLimitedStock;
    console.log(`  ${item.name}: stock_quantity=${item.stock_quantity}, isUnlimited=${isUnlimited}, hasLimitedStock=${hasLimitedStock}, hasStock=${hasStock}`);
    return hasStock;
  });

  // Select first available option or fallback to first option
  const selected = availableOption || option.items[0];
  console.log(`Selected for ${option.name}:`, selected);
  
  return selected;
}

// Test all options
console.log('=== NEW LOGIC: First available stock (including unlimited) ===');
mockProduct.product_options.forEach(option => {
  testNewOptionSelection(option);
});

console.log('\n=== Expected Results ===');
console.log('Size should select: S (first option, since M has stock but S comes first with unlimited)');
console.log('Wait... let me check the order again...');

// Let's be more specific about what "first" means
console.log('\n=== Re-checking Size selection ===');
const sizeOption = mockProduct.product_options[0];
console.log('Size items in order:');
sizeOption.items.forEach((item, index) => {
  const isUnlimited = item.stock_quantity === null || item.stock_quantity === "";
  const stockQty = parseInt(item.stock_quantity);
  const hasLimitedStock = !isNaN(stockQty) && stockQty > 0;
  const hasStock = isUnlimited || hasLimitedStock;
  console.log(`  ${index + 1}. ${item.name}: stock=${item.stock_quantity}, hasStock=${hasStock}`);
});

console.log('\nExpected: Should select M (first item with stock > 0)');
console.log('But if we want S to be selected, it means we need different logic...');
