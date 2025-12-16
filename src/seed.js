import connectDB from "./config/db.js";
import Dish from "./models/Dish.js";

const seedMenu = async () => {
  await connectDB();

  try {
    // Clear existing dishes to avoid duplicates
    await Dish.deleteMany({});
    console.log("🧹 Menu cleared. Seeding new data with REAL IMAGES...");

    const menuItems = [
      // --- STARTERS (10 Items) ---
      {
        name: "Avocado Shrimp Salad",
        category: "starter",
        description: "Fresh avocado served with grilled prawns and vinaigrette.",
        price: 2500,
        ingredients: ["avocado", "shrimp", "lettuce", "vinegar"],
        allergens: ["shellfish"],
        prepTime: 15,
        calories: 320,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1625944525533-472f083d3630?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Spicy Chicken Wings",
        category: "starter",
        description: "Crispy fried wings tossed in a spicy chili glaze.",
        price: 3000,
        ingredients: ["chicken wings", "chili sauce", "garlic", "ginger"],
        allergens: [],
        prepTime: 20,
        calories: 550,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Pumpkin Soup",
        category: "starter",
        description: "Creamy pumpkin soup served with garlic croutons.",
        price: 2000,
        ingredients: ["pumpkin", "cream", "onions", "bread"],
        allergens: ["lactose", "gluten"],
        prepTime: 25,
        calories: 280,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Fish Rolls",
        category: "starter",
        description: "Golden fried pastry filled with savory spiced fish.",
        price: 1500,
        ingredients: ["flour", "mackerel", "onions", "pepper"],
        allergens: ["gluten", "fish"],
        prepTime: 40,
        calories: 350,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop" // Generic spring roll style
      },
      {
        name: "Plantain Chips & Salsa",
        category: "starter",
        description: "Thinly sliced fried plantains with spicy tomato dip.",
        price: 1000,
        ingredients: ["plantain", "vegetable oil", "tomatoes", "chili"],
        allergens: [],
        prepTime: 10,
        calories: 300,
        isVegetarian: true,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1565599837634-134ac3d00a47?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Caesar Salad",
        category: "starter",
        description: "Romaine lettuce, parmesan cheese, croutons, and caesar dressing.",
        price: 3500,
        ingredients: ["lettuce", "parmesan", "croutons", "anchovies", "egg"],
        allergens: ["gluten", "lactose", "eggs", "fish"],
        prepTime: 15,
        calories: 380,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Pepper Soup",
        category: "starter",
        description: "Spicy broth with assorted meats and traditional herbs.",
        price: 3000,
        ingredients: ["beef", "tripe", "scent leaf", "pepper"],
        allergens: [],
        prepTime: 60,
        calories: 250,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1547592166-23acbe3a624b?q=80&w=600&auto=format&fit=crop" // Generic hearty soup
      },
      {
        name: "Bruschetta",
        category: "starter",
        description: "Toasted baguette topped with diced tomatoes, basil, and olive oil.",
        price: 2200,
        ingredients: ["baguette", "tomatoes", "basil", "olive oil"],
        allergens: ["gluten"],
        prepTime: 12,
        calories: 210,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1572695157363-bc3195019a2d?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Samosas",
        category: "starter",
        description: "Triangular pastry filled with spiced vegetables.",
        price: 1500,
        ingredients: ["flour", "potatoes", "peas", "spices"],
        allergens: ["gluten"],
        prepTime: 30,
        calories: 180,
        isVegetarian: true,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Garlic Butter Prawns",
        category: "starter",
        description: "Sautéed prawns in rich garlic and herb butter sauce.",
        price: 4500,
        ingredients: ["prawns", "butter", "garlic", "parsley"],
        allergens: ["shellfish", "lactose"],
        prepTime: 15,
        calories: 320,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop"
      },

      // --- MAIN COURSES (10 Items) ---
      {
        name: "Cameroonian Ndole",
        category: "main course",
        description: "Bitterleaf stew with peanuts, beef, and shrimp.",
        price: 4500,
        ingredients: ["bitterleaf", "peanuts", "beef", "shrimp", "garlic"],
        allergens: ["peanuts", "shellfish"],
        prepTime: 45,
        calories: 600,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop" // Closest stew visual
      },
      {
        name: "Grilled Sole Fish",
        category: "main course",
        description: "Fresh sole fish grilled to perfection with plantains.",
        price: 6000,
        ingredients: ["sole fish", "plantains", "spices", "oil"],
        allergens: ["fish"],
        prepTime: 35,
        calories: 450,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Poulet DG",
        category: "main course",
        description: "Chicken stew with plantains and mixed vegetables.",
        price: 5500,
        ingredients: ["chicken", "plantains", "carrots", "green beans", "tomatoes"],
        allergens: [],
        prepTime: 60,
        calories: 700,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://plus.unsplash.com/premium_photo-1661609673255-b463690d56df?q=80&w=600&auto=format&fit=crop" // Hearty chicken stew
      },
      {
        name: "Beef Filet Mignon",
        category: "main course",
        description: "Premium beef cut served with mashed potatoes and red wine sauce.",
        price: 12000,
        ingredients: ["beef filet", "potatoes", "butter", "red wine"],
        allergens: ["lactose"],
        prepTime: 25,
        calories: 650,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Vegetable Curry",
        category: "main course",
        description: "Mixed vegetables cooked in a creamy coconut curry sauce.",
        price: 4000,
        ingredients: ["coconut milk", "cauliflower", "peas", "carrots", "curry powder"],
        allergens: [],
        prepTime: 30,
        calories: 400,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Eru",
        category: "main course",
        description: "Traditional vegetable soup made with okok leaves and waterleaf.",
        price: 4000,
        ingredients: ["eru leaves", "waterleaf", "palm oil", "canda", "beef"],
        allergens: [],
        prepTime: 50,
        calories: 550,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop" // Green vegetable dish
      },
      {
        name: "Spaghetti Bolognese",
        category: "main course",
        description: "Italian pasta with rich meat and tomato sauce.",
        price: 4500,
        ingredients: ["spaghetti", "minced beef", "tomatoes", "onions", "parmesan"],
        allergens: ["gluten", "lactose"],
        prepTime: 25,
        calories: 500,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Grilled Lamb Chops",
        category: "main course",
        description: "Juicy lamb chops served with roasted vegetables.",
        price: 9000,
        ingredients: ["lamb", "rosemary", "garlic", "zucchini", "bell peppers"],
        allergens: [],
        prepTime: 30,
        calories: 600,
        isVegetarian: false,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Kondre (Pork Stew)",
        category: "main course",
        description: "Western region delicacy with pork and plantains.",
        price: 5000,
        ingredients: ["pork", "plantains", "njansang", "spices"],
        allergens: [],
        prepTime: 90,
        calories: 800,
        isVegetarian: false,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Mushroom Risotto",
        category: "main course",
        description: "Creamy Italian rice dish cooked with wild mushrooms.",
        price: 5500,
        ingredients: ["arborio rice", "mushrooms", "parmesan", "white wine", "butter"],
        allergens: ["lactose"],
        prepTime: 40,
        calories: 520,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop"
      },

      // --- DESSERTS (10 Items) ---
      {
        name: "Crème Brûlée",
        category: "dessert",
        description: "Rich custard base topped with a layer of hardened caramelized sugar.",
        price: 3000,
        ingredients: ["cream", "sugar", "egg vanilla"],
        allergens: ["lactose", "eggs"],
        prepTime: 30,
        calories: 450,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Chocolate Lava Cake",
        category: "dessert",
        description: "Warm chocolate cake with a molten chocolate center.",
        price: 3500,
        ingredients: ["chocolate", "butter", "flour", "eggs", "sugar"],
        allergens: ["lactose", "gluten", "eggs"],
        prepTime: 20,
        calories: 500,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Fruit Salad",
        category: "dessert",
        description: "Seasonal fresh fruits served with a honey drizzle.",
        price: 2000,
        ingredients: ["pineapple", "watermelon", "papaya", "honey"],
        allergens: [],
        prepTime: 10,
        calories: 150,
        isVegetarian: true,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Tiramisu",
        category: "dessert",
        description: "Coffee-flavoured Italian dessert.",
        price: 3500,
        ingredients: ["mascarpone", "coffee", "ladyfingers", "cocoa"],
        allergens: ["lactose", "gluten", "eggs"],
        prepTime: 45,
        calories: 480,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Cheesecake",
        category: "dessert",
        description: "Classic New York style cheesecake with strawberry topping.",
        price: 4000,
        ingredients: ["cream cheese", "graham crackers", "sugar", "strawberries"],
        allergens: ["lactose", "gluten"],
        prepTime: 60,
        calories: 550,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Puff-Puff (Sweet)",
        category: "dessert",
        description: "Sweet fried dough balls dusted with powdered sugar.",
        price: 1000,
        ingredients: ["flour", "sugar", "yeast", "oil"],
        allergens: ["gluten"],
        prepTime: 40,
        calories: 300,
        isVegetarian: true,
        chefName: "Chef Tifang",
        photoUrl: "https://images.unsplash.com/photo-1621251347648-2895f87b3260?q=80&w=600&auto=format&fit=crop" // Beignet style
      },
      {
        name: "Ice Cream Sundae",
        category: "dessert",
        description: "Three scoops of vanilla ice cream with chocolate syrup.",
        price: 2500,
        ingredients: ["milk", "cream", "sugar", "chocolate syrup"],
        allergens: ["lactose"],
        prepTime: 5,
        calories: 400,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Mango Mousse",
        category: "dessert",
        description: "Light and airy mango flavored dessert.",
        price: 2800,
        ingredients: ["mango", "cream", "gelatin", "sugar"],
        allergens: ["lactose"],
        prepTime: 30,
        calories: 250,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1505253304499-671c55fb57fe?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Apple Pie",
        category: "dessert",
        description: "Warm apple pie served with a scoop of vanilla ice cream.",
        price: 3200,
        ingredients: ["apples", "flour", "butter", "cinnamon"],
        allergens: ["gluten", "lactose"],
        prepTime: 50,
        calories: 420,
        isVegetarian: true,
        chefName: "Chef Marie",
        photoUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Crepes",
        category: "dessert",
        description: "Thin pancakes served with nutella and bananas.",
        price: 2500,
        ingredients: ["flour", "milk", "eggs", "nutella", "banana"],
        allergens: ["gluten", "lactose", "eggs", "nuts"],
        prepTime: 15,
        calories: 380,
        isVegetarian: true,
        chefName: "Chef Pierre",
        photoUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=600&auto=format&fit=crop"
      },

      // --- DRINKS (10 Items) ---
      {
        name: "Fresh Baobab Juice",
        category: "drink",
        description: "Natural chilled juice made from baobab fruit.",
        price: 1000,
        ingredients: ["baobab fruit", "water", "sugar"],
        allergens: [],
        prepTime: 5,
        calories: 120,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop" // Milky juice style
      },
      {
        name: "Folere (Hibiscus) Juice",
        category: "drink",
        description: "Refreshing drink made from hibiscus leaves (Bissap).",
        price: 1000,
        ingredients: ["hibiscus leaves", "water", "sugar", "pineapple"],
        allergens: [],
        prepTime: 5,
        calories: 110,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=600&auto=format&fit=crop" // Red juice
      },
      {
        name: "Ginger Juice",
        category: "drink",
        description: "Spicy and energizing fresh ginger drink.",
        price: 1000,
        ingredients: ["ginger", "lemon", "sugar", "water"],
        allergens: [],
        prepTime: 10,
        calories: 90,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Fresh Orange Juice",
        category: "drink",
        description: "100% freshly squeezed oranges.",
        price: 2000,
        ingredients: ["oranges"],
        allergens: [],
        prepTime: 5,
        calories: 110,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Pineapple Smoothie",
        category: "drink",
        description: "Blended pineapple with ice.",
        price: 2500,
        ingredients: ["pineapple", "ice", "honey"],
        allergens: [],
        prepTime: 5,
        calories: 140,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1632054236522-83b51664d5c9?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Mojito (Virgin)",
        category: "drink",
        description: "Mint, lime, sugar, and sparkling water.",
        price: 2500,
        ingredients: ["mint", "lime", "sugar", "soda water"],
        allergens: [],
        prepTime: 5,
        calories: 100,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Iced Coffee",
        category: "drink",
        description: "Chilled brewed coffee with milk and sugar.",
        price: 2000,
        ingredients: ["coffee", "milk", "sugar", "ice"],
        allergens: ["lactose"],
        prepTime: 5,
        calories: 120,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Lemonade",
        category: "drink",
        description: "Classic sweet and sour lemon drink.",
        price: 1500,
        ingredients: ["lemon", "water", "sugar"],
        allergens: [],
        prepTime: 5,
        calories: 100,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Mineral Water (Large)",
        category: "drink",
        description: "1.5L bottle of mineral water.",
        price: 1000,
        ingredients: ["water"],
        allergens: [],
        prepTime: 0,
        calories: 0,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1523362628408-89731a9d0284?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Red Wine (Glass)",
        category: "drink",
        description: "House red wine.",
        price: 3500,
        ingredients: ["grapes"],
        allergens: [],
        prepTime: 0,
        calories: 125,
        isVegetarian: true,
        chefName: "Barman Jo",
        photoUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop"
      }
    ];

    const createdDishes = await Dish.insertMany(menuItems);
    
    console.log(`✅ Success! ${createdDishes.length} items added to the Le Gourmet menu.`);
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedMenu();
