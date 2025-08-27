import mongoose from "mongoose";
import "dotenv/config";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Category from "../models/category.js";
import Wishlist from "../models/wishlist.js";
import Cart from "../models/cart.js";

const mockProducts = [
  {
    name: "Wireless Bluetooth Earbuds",
    description:
      "High-quality wireless earbuds with noise cancellation and 20hr battery life",
    price: 79.99,
    image: null,
    category: "Electronics",
    stock: 150,
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated 32oz stainless steel water bottle keeps drinks cold for 24hrs",
    price: 29.95,
    image: null,
    category: "Home",
    stock: 200,
  },
  {
    name: "Yoga Mat",
    description: "Eco-friendly 6mm thick yoga mat with carrying strap",
    price: 34.99,
    image: null,
    category: "Fitness",
    stock: 85,
  },
  {
    name: "Smart LED Light Bulb",
    description: "WiFi enabled RGB smart bulb controllable via smartphone",
    price: 19.99,
    image: null,
    category: "Home",
    stock: 120,
  },
  {
    name: "Wireless Charging Pad",
    description:
      "10W fast wireless charging pad compatible with Qi-enabled devices",
    price: 24.95,
    image: null,
    category: "Electronics",
    stock: 75,
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "100% organic cotton crew neck t-shirt available in multiple colors",
    price: 22.5,
    image: null,
    category: "Clothing",
    stock: 300,
  },
  {
    name: "Ceramic Coffee Mug",
    description: "16oz handmade ceramic mug with comfortable grip handle",
    price: 12.99,
    image: null,
    category: "Home",
    stock: 180,
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof speaker with 12hr playtime",
    price: 45.0,
    image: null,
    category: "Electronics",
    stock: 60,
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather bifold wallet with RFID protection",
    price: 39.95,
    image: null,
    category: "Accessories",
    stock: 110,
  },
  {
    name: "Air Fryer",
    description: "5.8qt digital air fryer with 7 preset cooking functions",
    price: 89.99,
    image: null,
    category: "Kitchen",
    stock: 45,
  },
  {
    name: "Fitness Tracker Watch",
    description:
      "Waterproof activity tracker with heart rate monitor and sleep tracking",
    price: 59.99,
    image: null,
    category: "Fitness",
    stock: 90,
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ergonomic gaming mouse with 16000 DPI and RGB lighting",
    price: 49.99,
    image: null,
    category: "Electronics",
    stock: 70,
  },
  {
    name: "Memory Foam Pillow",
    description: "Certified orthopedic memory foam pillow for neck support",
    price: 35.5,
    image: null,
    category: "Home",
    stock: 95,
  },
  {
    name: "Resistance Bands Set",
    description:
      "5-piece fitness resistance bands with handles and ankle straps",
    price: 27.99,
    image: null,
    category: "Fitness",
    stock: 130,
  },
  {
    name: "Electric Toothbrush",
    description: "Sonic electric toothbrush with 4 brush heads and travel case",
    price: 59.95,
    image: null,
    category: "Health",
    stock: 80,
  },
  {
    name: "Laptop Backpack",
    description:
      "Water-resistant backpack with USB charging port and laptop compartment",
    price: 42.0,
    image: null,
    category: "Accessories",
    stock: 65,
  },
  {
    name: "Cast Iron Skillet",
    description:
      '10.25" pre-seasoned cast iron skillet for all cooking surfaces',
    price: 29.99,
    image: null,
    category: "Kitchen",
    stock: 55,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Over-ear Bluetooth headphones with 30hr battery life",
    price: 199.99,
    image: null,
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Yoga Block",
    description: "High density foam yoga block for support and alignment",
    price: 14.99,
    image: null,
    category: "Fitness",
    stock: 150,
  },
  {
    name: "Smart Doorbell",
    description:
      "1080p HD video doorbell with two-way audio and motion detection",
    price: 129.0,
    image: null,
    category: "Home",
    stock: 30,
  },
  {
    name: "Wireless Keyboard",
    description:
      "Slim wireless keyboard with quiet touch keys and 2-year battery life",
    price: 34.95,
    image: null,
    category: "Electronics",
    stock: 90,
  },
  {
    name: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with 7 color LED lights",
    price: 25.99,
    image: null,
    category: "Home",
    stock: 75,
  },
  {
    name: "Digital Meat Thermometer",
    description: "Instant read thermometer with backlit display for cooking",
    price: 16.99,
    image: null,
    category: "Kitchen",
    stock: 110,
  },
  {
    name: "Acrylic Paint Set",
    description: "24-color acrylic paint set with brushes and palette",
    price: 29.95,
    image: null,
    category: "Arts",
    stock: 60,
  },
  {
    name: "Car Phone Mount",
    description: "Dashboard magnetic phone mount for hands-free navigation",
    price: 18.99,
    image: null,
    category: "Automotive",
    stock: 85,
  },
  {
    name: "Reusable Shopping Bags",
    description: "Pack of 5 foldable reusable grocery bags",
    price: 15.5,
    image: null,
    category: "Home",
    stock: 200,
  },
  {
    name: "Electric Kettle",
    description: "1.7L stainless steel electric kettle with auto shut-off",
    price: 39.99,
    image: null,
    category: "Kitchen",
    stock: 50,
  },
  {
    name: "Hair Dryer",
    description: "1875W professional ionic hair dryer with concentrator",
    price: 59.95,
    image: null,
    category: "Beauty",
    stock: 40,
  },
  {
    name: "Weighted Blanket",
    description: "15lb cooling weighted blanket for better sleep",
    price: 89.99,
    image: null,
    category: "Home",
    stock: 35,
  },
  {
    name: "French Press Coffee Maker",
    description: "34oz stainless steel french press for coffee and tea",
    price: 24.95,
    image: null,
    category: "Kitchen",
    stock: 70,
  },
  {
    name: "Adjustable Dumbbell Set",
    description: "Single adjustable dumbbell with 5-25lb weight range",
    price: 129.99,
    image: null,
    category: "Fitness",
    stock: 25,
  },
  {
    name: "Solar Power Bank",
    description: "20000mAh solar charger with 4 USB ports for outdoor use",
    price: 49.95,
    image: null,
    category: "Electronics",
    stock: 55,
  },
  {
    name: "Desk Organizer",
    description: "Wooden desk organizer with compartments for office supplies",
    price: 32.99,
    image: null,
    category: "Office",
    stock: 90,
  },
  {
    name: "Garden Hose",
    description: "50ft expandable garden hose with 10 pattern spray nozzle",
    price: 36.95,
    image: null,
    category: "Garden",
    stock: 45,
  },
  {
    name: "Puzzle Board Game",
    description: "Family strategy board game for 2-4 players",
    price: 29.99,
    image: null,
    category: "Games",
    stock: 65,
  },
  {
    name: "Sunglasses",
    description: "UV protection polarized sunglasses with case",
    price: 19.99,
    image: null,
    category: "Accessories",
    stock: 120,
  },
  {
    name: "Electric Blanket",
    description: "Queen size electric blanket with 10 heat settings",
    price: 59.99,
    image: null,
    category: "Home",
    stock: 30,
  },
  {
    name: "Chef's Knife",
    description: '8" professional chef knife with ergonomic handle',
    price: 45.95,
    image: null,
    category: "Kitchen",
    stock: 50,
  },
  {
    name: "Facial Cleansing Brush",
    description: "Waterproof electronic facial cleansing brush with 3 speeds",
    price: 39.99,
    image: null,
    category: "Beauty",
    stock: 75,
  },
  {
    name: "Hammock",
    description: "Portable camping hammock with carabiners and carrying bag",
    price: 34.95,
    image: null,
    category: "Outdoor",
    stock: 40,
  },
  {
    name: "Wireless Earbuds Case",
    description: "Silicone protective case for wireless earbuds with keychain",
    price: 12.99,
    image: null,
    category: "Accessories",
    stock: 180,
  },
  {
    name: "Digital Picture Frame",
    description: '10" WiFi digital photo frame with 16GB storage',
    price: 99.0,
    image: null,
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Linen Sheets Set",
    description: "100% linen sheet set with pillowcases (Queen size)",
    price: 149.99,
    image: null,
    category: "Home",
    stock: 20,
  },
  {
    name: "Puzzle Mat",
    description: "Roll-up puzzle mat for storing unfinished puzzles",
    price: 22.95,
    image: null,
    category: "Games",
    stock: 65,
  },
  {
    name: "Car Vacuum Cleaner",
    description: "Portable cordless car vacuum with multiple attachments",
    price: 49.99,
    image: null,
    category: "Automotive",
    stock: 45,
  },
  {
    name: "Essential Oils Set",
    description: "6-pack therapeutic grade essential oils with dropper",
    price: 29.95,
    image: null,
    category: "Health",
    stock: 90,
  },
  {
    name: "Resistance Loop Bands",
    description: "Set of 5 resistance bands for physical therapy and workouts",
    price: 19.99,
    image: null,
    category: "Fitness",
    stock: 110,
  },
  {
    name: "Reusable Straw Set",
    description: "4 stainless steel straws with cleaning brush and case",
    price: 14.99,
    image: null,
    category: "Kitchen",
    stock: 150,
  },
  {
    name: "Back Massager",
    description: "Electric shiatsu back massager with heat function",
    price: 79.95,
    image: null,
    category: "Health",
    stock: 35,
  },
  {
    name: "Smart Plug",
    description: "WiFi smart plug works with Alexa and Google Assistant",
    price: 24.99,
    image: null,
    category: "Home",
    stock: 80,
  },
];
const mockCategories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
    displayOrder: 1,
  },
  {
    name: "Home",
    description: "Home and living products",
    displayOrder: 2,
  },
  {
    name: "Fitness",
    description: "Fitness equipment and accessories",
    displayOrder: 3,
  },
  {
    name: "Clothing",
    description: "Clothing and apparel",
    displayOrder: 4,
  },
  {
    name: "Accessories",
    description: "Fashion accessories",
    displayOrder: 5,
  },
  {
    name: "Kitchen",
    description: "Kitchen appliances and tools",
    displayOrder: 6,
  },
  {
    name: "Health",
    description: "Health and wellness products",
    displayOrder: 7,
  },
  {
    name: "Beauty",
    description: "Beauty and personal care products",
    displayOrder: 8,
  },
  {
    name: "Office",
    description: "Office supplies and equipment",
    displayOrder: 9,
  },
  {
    name: "Garden",
    description: "Gardening tools and supplies",
    displayOrder: 10,
  },
  {
    name: "Games",
    description: "Games and puzzles",
    displayOrder: 11,
  },
  {
    name: "Outdoor",
    description: "Outdoor and camping gear",
    displayOrder: 12,
  },
  {
    name: "Automotive",
    description: "Automotive accessories",
    displayOrder: 13,
  },
  {
    name: "Arts",
    description: "Arts and crafts supplies",
    displayOrder: 14,
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB ✅");

    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared old products 🗑️");

    await Wishlist.deleteMany({});
    console.log("Cleared old wishlists 🗑️");

    await Cart.deleteMany();
    console.log("Cleared old carts 🗑️");

    await Order.deleteMany({});
    console.log("Cleared old orders 🗑️");

    await Category.deleteMany({});
    console.log("Cleared old categories 🗑️");

    // Insert categories
    const categories = await Category.insertMany(mockCategories);
    console.log("Inserted categories 🎉");

    // Create a mapping of category names to their IDs
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name] = {
        id: category._id,
        name: category.name,
      };
    });

    for (let product of mockProducts) {
      const categoryInfo = categoryMap[product.category];

      product.image = `uploads/${product.name}.jpeg`;
      product.onSale = Math.random() < 0.3; // 30% chance of being on sale
      product.isFeatured = Math.random() < 0.2; // 20% chance featured
      product.rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      product.numReviews = Math.floor(Math.random() * 500) + 1; // 0-500 reviews
      product.category = categoryMap[product.category]; // map category name to ID
      product.category = categoryInfo.id; // Set to ObjectId
      product.categoryName = categoryInfo.name; // Set to category name string

      if (product.onSale) {
        // random 10-40% discount
        const discount = product.price * (Math.random() * 0.3 + 0.1);
        product.discountPrice = parseFloat(
          (product.price - discount).toFixed(2)
        );
      } else {
        product.discountPrice = null;
      }
    }

    // Insert mock products
    await Product.insertMany(mockProducts);
    console.log("Inserted 50 mock products 🎉");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDB();
