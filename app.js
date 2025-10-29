// Load the packages 
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const shopRoutes = require('./routes/shop');


const app = express();

function generateOrderNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}


app.use(session({
  secret: 'G00472939', // Secret key to sign the session ID 
  resave: false, // Prevents saving session 
  saveUninitialized: false // Prevents saving uninitialized sessions
}));

app.use(bodyParser.urlencoded({extended: true})); // Helps read HTML 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//function to protect the routes
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
   return res.redirect('/login ');
  }
}
app.get('/login', (req, res) => {
    console.log('Login page accessed');
    res.render('login');
  });

//login form
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'user@123.com' && password === 'pass') {
      req.session.loggedIn = true;
      res.redirect('/');
    } else {
      res.send('<h1>Login Failed</h1><p>Invalid credentials. <a href="/">Try again</a></p>');
    }
  });

app.get('/confirmation', isAuthenticated, (req, res) => {
    res.render('confirmation');
  });

  app.post('/order', isAuthenticated, (req, res) => {
    const cart = req.session.cart || []; //  declare cart FIRST
  
    if (cart.length === 0) {
      return res.send("Your cart is empty.");
    }
  
    //  Calculate total  items
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const orderNumber = generateOrderNumber();
  
    // Render confirmation with cart info
    res.render('confirmation', {
      orderNumber,
      total,
      customerEmail: req.session.userEmail,
      cart
    });
  
    // Optionally clear cart 
    req.session.cart = [];
  });
  
    app.use('/' , shopRoutes); 

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
