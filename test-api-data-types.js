// Test script to understand API data parsing issues

// Test different data types that the API might return
const testCases = [
  {
    name: "Numbers as numbers",
    items: [
      { name: "S", stock_quantity: 0 },
      { name: "M", stock_quantity: 2 },
      { name: "L", stock_quantity: 0 },
      { name: "XL", stock_quantity: null }
    ]
  },
  {
    name: "Numbers as strings",
    items: [
      { name: "S", stock_quantity: "0" },
      { name: "M", stock_quantity: "2" },
      { name: "L", stock_quantity: "0" },
      { name: "XL", stock_quantity: "" }
    ]
  },
  {
    name: "Mixed types (like real API)",
    items: [
      { name: "S", stock_quantity: "0" },
      { name: "M", stock_quantity: "2" },
      { name: "L", stock_quantity: "0" },
      { name: "XL", stock_quantity: "" }
    ]
  }
];

function testOptionSelection(testCase) {
  console.log(`\n=== Testing: ${testCase.name} ===`);
  
  // Original logic (might fail with strings)
  console.log("\nOriginal logic:");
  const availableOption1 = testCase.items.find(
    (item) => item.stock_quantity > 0
  );
  console.log("Available option (stock > 0):", availableOption1);
  
  // Updated logic (with parseInt)
  console.log("\nUpdated logic:");
  const availableOption2 = testCase.items.find((item) => {
    const stockQty = parseInt(item.stock_quantity);
    const hasStock = !isNaN(stockQty) && stockQty > 0;
    console.log(`  ${item.name}: stock_quantity=${item.stock_quantity}, parsed=${stockQty}, hasStock=${hasStock}`);
    return hasStock;
  });
  console.log("Available option (with parseInt):", availableOption2);
  
  // Unlimited stock option
  const unlimitedStockOption = testCase.items.find(
    (item) => item.stock_quantity === null || item.stock_quantity === ""
  );
  console.log("Unlimited stock option:", unlimitedStockOption);
  
  // Final selection
  const selected = availableOption2 || unlimitedStockOption || testCase.items[0];
  console.log("Final selected:", selected);
}

// Test all cases
testCases.forEach(testCase => {
  testOptionSelection(testCase);
});
