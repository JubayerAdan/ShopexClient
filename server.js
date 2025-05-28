const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors()); 
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://ecoluxe:5Fk7ULVqJGSRt8ML@cluster0.x4gxtwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Initialize MongoDB collections
let usersCollection;
let cartCollection;
let productCollection;
let userActivityCollection;

// Connect to MongoDB and set up collections and routes
async function connectDB() {
  try {
    await client.connect();
    console.log("Pinging MongoDB to confirm connection...");
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Initialize collections
    usersCollection = client.db("ecoluxe").collection("users");
    cartCollection = client.db("ecoluxe").collection("cart");
    productCollection = client.db("ecoluxe").collection("products");
    userActivityCollection = client.db("ecoluxe").collection("userActivity");

    // --- User Routes ---
    app.post("/register", async (req, res) => {
      try {
        // Add validation
        if (!req.body.google && !req.body.password) {
          return res.status(400).json({ error: "Password required for manual registration" });
        }
        
        const { name, email, password } = req.body;
        const photo = req.body.photo ? req.body.photo : null;
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ error: "User already exists" });
        }

        // Initialize user with default preferences
        const User = { 
          name, 
          email, 
          password, 
          photo,
          preferences: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            recentlyViewed: [],
            favoriteProducts: []
          },
          createdAt: new Date()
        };

        const result = await usersCollection.insertOne(User);
        res.status(201).json(result);
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
      }
    });

    // --- Personalized Feed Routes ---
    app.get("/feed/personalized", async (req, res) => {
      try {
        const { email, page = 1, limit = 6 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get user data
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Initialize preferences if they don't exist
        if (!user.preferences) {
          await usersCollection.updateOne(
            { email },
            {
              $set: {
                preferences: {
                  categories: [],
                  priceRange: { min: 0, max: 1000 },
                  recentlyViewed: [],
                  favoriteProducts: []
                }
              }
            }
          );
          user.preferences = {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            recentlyViewed: [],
            favoriteProducts: []
          };
        }

        // Get user's preferences and activity
        const { preferences } = user;
        const userActivity = await userActivityCollection.findOne({ email }) || {};
        const viewedProducts = userActivity.viewedProducts || [];
        const purchasedProducts = userActivity.purchasedProducts || [];

        // Create a scoring system for products
        const productScores = new Map();

        // 1. Score based on preferred categories
        if (preferences.categories && preferences.categories.length > 0) {
          const categoryProducts = await productCollection
            .find({ category: { $in: preferences.categories } })
            .toArray();

          categoryProducts.forEach(product => {
            productScores.set(product._id.toString(), 3); // Higher weight for preferred categories
          });
        }

        // 2. Score based on price range preference
        const priceRangeProducts = await productCollection
          .find({
            price: {
              $gte: preferences.priceRange.min,
              $lte: preferences.priceRange.max
            }
          })
          .toArray();

        priceRangeProducts.forEach(product => {
          const currentScore = productScores.get(product._id.toString()) || 0;
          productScores.set(product._id.toString(), currentScore + 1);
        });

        // 3. Score based on viewing history
        viewedProducts.forEach(productId => {
          const currentScore = productScores.get(productId) || 0;
          productScores.set(productId, currentScore + 2);
        });

        // 4. Score based on purchase history
        purchasedProducts.forEach(productId => {
          const currentScore = productScores.get(productId) || 0;
          productScores.set(productId, currentScore + 4); // Highest weight for purchased items
        });

        // 5. Get trending products
        const trendingProducts = await productCollection
          .find()
          .sort({ viewCount: -1, purchaseCount: -1 })
          .limit(10)
          .toArray();

        trendingProducts.forEach(product => {
          const currentScore = productScores.get(product._id.toString()) || 0;
          productScores.set(product._id.toString(), currentScore + 1);
        });

        // Get all products and apply scoring
        const allProducts = await productCollection.find().toArray();
        const scoredProducts = allProducts.map(product => ({
          ...product,
          score: productScores.get(product._id.toString()) || 0
        }));

        // Sort products by score
        scoredProducts.sort((a, b) => b.score - a.score);

        // Apply pagination
        const paginatedProducts = scoredProducts.slice(skip, skip + limitNum);
        const totalPages = Math.ceil(scoredProducts.length / limitNum);

        // Get recently viewed products
        const recentlyViewed = preferences.recentlyViewed && preferences.recentlyViewed.length > 0
          ? await productCollection
              .find({ _id: { $in: preferences.recentlyViewed.map(id => new ObjectId(id)) } })
              .limit(4)
              .toArray()
          : [];

        // Get similar products based on most viewed category
        const mostViewedCategory = await productCollection
          .aggregate([
            { $match: { _id: { $in: viewedProducts.map(id => new ObjectId(id)) } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
          ])
          .toArray();

        const similarProducts = mostViewedCategory.length > 0
          ? await productCollection
              .find({ 
                category: mostViewedCategory[0]._id,
                _id: { $nin: [...viewedProducts, ...purchasedProducts].map(id => new ObjectId(id)) }
              })
              .limit(4)
              .toArray()
          : [];

        res.json({
          products: paginatedProducts,
          totalPages,
          currentPage: pageNum,
          totalProducts: scoredProducts.length,
          recentlyViewed,
          similarProducts,
          trendingProducts
        });
      } catch (error) {
        console.error("Fetch personalized feed error:", error);
        res.status(500).json({ error: "Failed to fetch personalized feed" });
      }
    });

    // --- Product Routes ---
    app.get("/products", async (req, res) => {
      try {
        const { 
          category = "all", 
          page = 1, 
          limit = 12, // Default limit matching frontend
          search, 
          minPrice, 
          maxPrice, 
          sort = "relevant", // Default sort matching frontend
          minRating // Using minRating to filter by minimum star rating
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const query = {};

        // Add search query to the MongoDB query
        if (search) {
          // Using a case-insensitive regex search on product name
          query.name = { $regex: new RegExp(search, 'i') };
        }

        // Add category filter to the MongoDB query (if not 'all')
        if (category && category !== "all") {
          // If there's already a search query, combine with category using $and
          if (query.name) {
            query.$and = [ { name: query.name }, { category: category } ];
            delete query.name; // Remove the original name query
          } else {
            query.category = category;
          }
        }

        // Add price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
            if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
        }

        // Add rating filter
        // Assuming products have a 'rating' field (e.g., average star rating)
        if (minRating !== undefined) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        const skip = (pageNum - 1) * limitNum;

        // Determine sort options
        let sortOptions = {};
        switch (sort) {
          case "price_asc":
            sortOptions = { price: 1 };
            break;
          case "price_desc":
            sortOptions = { price: -1 };
            break;
          case "newest":
            sortOptions = { createdAt: -1 }; // Assuming a createdAt field
            break;
          case "rating":
            sortOptions = { rating: -1, viewCount: -1 }; // Sort by rating, then views
            break;
          case "popular":
             sortOptions = { viewCount: -1, purchaseCount: -1 }; // Sort by views, then purchases
             break;
          case "relevant":
          default:
             // For relevance, we might ideally use text search scores or a custom logic.
             // For now, we can default to newest or a combination if no search term is present.
             // If a search term is present, a proper text index would be needed for true relevance.
             // Falling back to newest or views as a placeholder for 'relevant' without text search.
             if (search) {
                // With a text index, this would be { $score: { $meta: "textScore" } }
                sortOptions = {}; // Rely on default MongoDB sort or implement basic relevance
             } else {
                sortOptions = { createdAt: -1 }; // Default sort if no search
             }
            break;
        }
        
        // Fetch total count of products matching the query
        const totalProducts = await productCollection.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNum);

        // Fetch products with filtering, sorting, and pagination
        const products = await productCollection
          .find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .toArray();

        res.json({
          products,
          totalPages,
          currentPage: pageNum,
          totalProducts,
        });
      } catch (error) {
        console.error("Fetch products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
      }
    });

    // --- Cart Routes ---
    app.post("/cart", async (req, res) => {
      try {
        const { email, product } = req.body;
        if (!email || !product) {
          return res.status(400).json({ error: "Email and product are required" });
        }
        // Add quantity if not present, default to 1
        const cartItem = { email, ...product, quantity: product.quantity || 1 };
        const result = await cartCollection.insertOne(cartItem);
        res.status(201).json(result);
      } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: "Failed to add to cart" });
      }
    });

    app.get("/cart/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const items = await cartCollection.find({ email }).toArray();
        res.json(items);
      } catch (error) {
        console.error("Fetch cart error:", error);
        res.status(500).json({ error: "Failed to fetch cart items" });
      }
    });

    // Update cart item quantity
    app.put("/cart/update", async (req, res) => {
      try {
        const { email, _id, quantity } = req.body;
        console.log('Update cart request:', { email, _id, quantity }); // Debug log

        if (!email || !_id || quantity === undefined) {
          console.log('Missing required fields:', { email, _id, quantity }); // Debug log
          return res.status(400).json({ 
            error: "Missing required fields",
            details: { email: !email, _id: !_id, quantity: quantity === undefined }
          });
        }

        const result = await cartCollection.updateOne(
          { email, _id: new ObjectId(_id) },
          { $set: { quantity } }
        );

        console.log('Update result:', result); // Debug log

        if (result.matchedCount === 0) {
          console.log('No matching document found for:', { email, _id }); // Debug log
          return res.status(404).json({ 
            error: "Cart item not found",
            details: { email, _id }
          });
        }

        res.json({ success: true, result });
      } catch (error) {
        console.error("Update cart error:", {
          error: error.message,
          stack: error.stack,
          requestBody: req.body
        });
        res.status(500).json({ 
          error: "Failed to update cart",
          details: error.message
        });
      }
    });

    // Remove item from cart
    app.delete("/cart/remove", async (req, res) => {
      try {
        const { email, _id } = req.body;
        console.log('Remove cart request:', { email, _id }); // Debug log

        if (!email || !_id) {
          console.log('Missing required fields:', { email, _id }); // Debug log
          return res.status(400).json({ 
            error: "Missing required fields",
            details: { email: !email, _id: !_id }
          });
        }

        const result = await cartCollection.deleteOne({
          email,
          _id: new ObjectId(_id)
        });

        console.log('Delete result:', result); // Debug log

        if (result.deletedCount === 0) {
          console.log('No document found to delete:', { email, _id }); // Debug log
          return res.status(404).json({ 
            error: "Cart item not found",
            details: { email, _id }
          });
        }

        res.json({ success: true, result });
      } catch (error) {
        console.error("Remove from cart error:", {
          error: error.message,
          stack: error.stack,
          requestBody: req.body
        });
        res.status(500).json({ 
          error: "Failed to remove from cart",
          details: error.message
        });
      }
    });

    // Clear cart
    app.delete("/cart/clear/:email", async (req, res) => {
      try {
        const { email } = req.params;
        if (!email) {
          return res.status(400).json({ error: "Email is required" });
        }

        const result = await cartCollection.deleteMany({ email });
        res.json({ success: true, deletedCount: result.deletedCount });
      } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ error: "Failed to clear cart" });
      }
    });

    // --- User Activity Routes ---
    app.post("/track-view", async (req, res) => {
      try {
        const { email, productId } = req.body;
        if (!email || !productId) {
          return res.status(400).json({ error: "Email and productId are required" });
        }

        // Update user's recently viewed products (keep last 20)
        await usersCollection.updateOne(
          { email },
          {
            $push: {
              "preferences.recentlyViewed": {
                $each: [productId],
                $slice: -20
              }
            }
          }
        );

        // Update product view count for trending calculation
        await productCollection.updateOne(
          { _id: new ObjectId(productId) },
          { $inc: { viewCount: 1 } }
        );

        // Update user activity
        await userActivityCollection.updateOne(
          { email },
          {
            $addToSet: { viewedProducts: productId },
            $set: { lastViewed: new Date() }
          },
          { upsert: true }
        );

        res.json({ success: true });
      } catch (error) {
        console.error("Track view error:", error);
        res.status(500).json({ error: "Failed to track product view" });
      }
    });

    // Track purchase
    app.post("/track-purchase", async (req, res) => {
      try {
        const { email, productId } = req.body;
        if (!email || !productId) {
          return res.status(400).json({ error: "Email and productId are required" });
        }

        // Update product purchase count
        await productCollection.updateOne(
          { _id: new ObjectId(productId) },
          { $inc: { purchaseCount: 1 } }
        );

        // Update user activity
        await userActivityCollection.updateOne(
          { email },
          {
            $addToSet: { purchasedProducts: productId },
            $set: { lastPurchased: new Date() }
          },
          { upsert: true }
        );

        res.json({ success: true });
      } catch (error) {
        console.error("Track purchase error:", error);
        res.status(500).json({ error: "Failed to track purchase" });
      }
    });

    // Update user preferences
    app.put("/user/preferences", async (req, res) => {
      try {
        const { email, preferences } = req.body;
        if (!email || !preferences) {
          return res.status(400).json({ error: "Email and preferences are required" });
        }

        const result = await usersCollection.updateOne(
          { email },
          { $set: { preferences } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true });
      } catch (error) {
        console.error("Update preferences error:", error);
        res.status(500).json({ error: "Failed to update preferences" });
      }
    });

    // Get user preferences
    app.get("/user/preferences/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const user = await usersCollection.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json(user.preferences || {
          categories: [],
          priceRange: { min: 0, max: 1000 },
          recentlyViewed: [],
          favoriteProducts: []
        });
      } catch (error) {
        console.error("Get preferences error:", error);
        res.status(500).json({ error: "Failed to get preferences" });
      }
    });

    // Search products
    app.get("/search", async (req, res) => {
      try {
        const { query, page = 1, limit = 6 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        if (!query) {
          return res.status(400).json({ error: "Search query is required" });
        }

        // Create search query
        const searchQuery = {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
          ]
        };

        // Fetch products with pagination
        const products = await productCollection
          .find(searchQuery)
          .skip(skip)
          .limit(limitNum)
          .toArray();

        // Get total count for pagination
        const totalProducts = await productCollection.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.json({
          products,
          totalPages,
          currentPage: pageNum,
          totalProducts
        });
      } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search products" });
      }
    });

    // Get product suggestions
    app.get("/search/suggestions", async (req, res) => {
      try {
        const { query } = req.query;
        if (!query) {
          return res.status(400).json({ error: "Search query is required" });
        }

        const suggestions = await productCollection
          .find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { category: { $regex: query, $options: 'i' } }
            ]
          })
          .project({ name: 1, category: 1, _id: 0 })
          .limit(5)
          .toArray();

        res.json(suggestions);
      } catch (error) {
        console.error("Get suggestions error:", error);
        res.status(500).json({ error: "Failed to get suggestions" });
      }
    });

    // Get trending products
    app.get("/products/trending", async (req, res) => {
      try {
        const trendingProducts = await productCollection
          .find()
          .sort({ viewCount: -1, purchaseCount: -1 })
          .limit(10)
          .toArray();

        res.json(trendingProducts);
      } catch (error) {
        console.error("Get trending products error:", error);
        res.status(500).json({ error: "Failed to get trending products" });
      }
    });

    // Get similar products
    app.get("/products/similar/:productId", async (req, res) => {
      try {
        const { productId } = req.params;
        const product = await productCollection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        const similarProducts = await productCollection
          .find({
            category: product.category,
            _id: { $ne: new ObjectId(productId) }
          })
          .limit(4)
          .toArray();

        res.json(similarProducts);
      } catch (error) {
        console.error("Get similar products error:", error);
        res.status(500).json({ error: "Failed to get similar products" });
      }
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Call the function to connect and set up routes
connectDB().then(() => {
  app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(console.dir);
