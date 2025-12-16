import connectDB from "./config/db.js";
import Dish from "../src/models/Dish.js";
import Table from "../src/models/Tables.js";
import Order from "../src/models/Order.js";

connectDB();

const runRestaurantSimulation = async () => {
  try {
    // 1. Setup: Create a Table and a Dish
    // Clean up old data for this test run
    await Dish.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});

    const table1 = await Table.create({
      tableNumber: 1,
      location: "inside",
      capacity: 4
    });

    const steakDish = await Dish.create({
      name: "Grilled Steak",
      category: "main course",
      price: 15000, // Original Price: 15,000 CFA
      description: "Tender beef with sauce",
      isAvailable: true
    });

    console.log(`🍽️  Menu Item Created: ${steakDish.name} (Price: ${steakDish.price} CFA)`);

    // 2. Action: Customer places an order
    // CRITICAL: We copy the name and price from the dish to the order
    const order1 = await Order.create({
      orderNumber: "ORD-001",
      tableNumber: table1.tableNumber,
      customer: {
        firstName: "John",
        lastName: "Doe",
        phone: "670000000"
      },
      items: [
        {
          dishId: steakDish._id,
          name: steakDish.name,   // SNAPSHOT: Copy name
          price: steakDish.price, // SNAPSHOT: Copy price (15,000)
          quantity: 2
        }
      ],
      totalAmount: steakDish.price * 2
    });

    console.log(`📝 Order Created! Total: ${order1.totalAmount} CFA`);

    // 3. Scenario: Inflation hits! The restaurant raises the price of Steak.
    steakDish.price = 18000;
    await steakDish.save();
    console.log(`📈 Price Update: Steak is now ${steakDish.price} CFA on the menu.`);

    // 4. Verification: Check the old order. It should still say 15,000.
    const fetchedOrder = await Order.findOne({ orderNumber: "ORD-001" });
    const orderItemPrice = fetchedOrder.items[0].price;

    console.log(`----------------------------------------`);
    console.log(`VERIFICATION RESULT:`);
    console.log(`Order Price: ${orderItemPrice} CFA (Should be 15000)`);
    console.log(`Current Menu Price: ${steakDish.price} CFA (Should be 18000)`);
    
    if (orderItemPrice !== steakDish.price) {
        console.log("✅ SUCCESS: The order kept the old price!");
    } else {
        console.log("❌ FAIL: The order price changed incorrectly.");
    }
    console.log(`----------------------------------------`);

  } catch (error) {
    console.error("Simulation failed:", error);
  }
};

runRestaurantSimulation();
