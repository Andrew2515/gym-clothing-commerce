const express = require('express');
const router = express.Router();
const db = require('../db'); // This connects to your database

// 🔐 Protect all routes
router.use((req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/login'); // ✅ Corrected from req.redirect
    }
}); // ✅ THIS was missing — closes the middleware block!

// Homepage
router.get('/', (req, res) => {
    res.render('index');
});

// Products
router.get('/product', async (req, res) => {
    try {
        const [product] = await db.query('SELECT * FROM product');
        res.render('product', { product });
    } catch (err) {
        res.send("Database error: " + err);
    }
});

// Checkout
router.post('/checkout', (req, res) => {
    const { name, email, product, quantity } = req.body;

    if (!name || !email || !product || !quantity) {
        return res.send("Fill in all fields.");
    }

    const unitPrice = parseFloat(product); // Simulated price
    const total = (unitPrice * parseInt(quantity)).toFixed(2);
    const orderNumber = Math.floor(Math.random() * 1000000);

    res.render('confirmation', {
        name,
        email,
        product,
        quantity,
        total,
        orderNumber
    });
});
// Existing routes above here, like /product, /checkout, etc.

// 🛒 Add to Cart Route
// POST route to add a product to cart
router.post('/add-to-cart', (req, res) => {
    // Destructure product info from the form 
    const { productId, productName, price, quantity } = req.body;
  
    // If no cart exists in the current session, show an empty one
    if (!req.session.cart) req.session.cart = [];
  
    // Check if the product already in cart 
    const existing = req.session.cart.find(item => item.productId === productId);
  
    if (existing) {
      //  If the product is already in the cart, increase the quantity
      existing.quantity += parseInt(quantity);
    } else {
      //  Otherwise, add the new product 
      req.session.cart.push({
        productId,                    // Product's unique ID
        productName,                  // Name of the product
        price: parseFloat(price),     // Convert price from string to number
        quantity: parseInt(quantity)  // Convert quantity from string to number
      });
    }
  
    // After adding to cart, redirect the user to the cart page 
    res.redirect('/cart');
  });
  
  
  // 🛍️ View Cart Route
  router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    console.log('Cart contents:', cart); //Logs array if empty

    res.render('cart', { cart, userEmail: req.session.userEmail });
  });
  

  // ✅ Export router at the very end
module.exports = router;
