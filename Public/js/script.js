<script>
  // This function is called when the form is submitted to validate its inputs
  function validateForm() {
    
    // Retrieve the value entered in the "customerName" remove extra space
    const name = document.getElementById('customerName').value.trim();
    
    // Retrieve the value entered in the "emailAddress" and remove extra space
    const email = document.getElementById('emailAddress').value.trim();
    
    // Retrieve the value entered in the "qty" (quantity) 
    const quantity = parseInt(document.getElementById('qty').value);
    
    // Check if the "name" the "email" field is empty, and the "quantity" is less than 1
    if (!name || !email || isNan(quantity) || quanity < 1) {
      // If fields are invalid, show an alert 
      alert('Please fill in all fields correctly.')
    
      
      // Prevent from being submitted (return false)
      return false; 
    }
    

    // If all fields work, allow submission
    return true;
  }
  
  function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.push({ name, price });

  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${name} has been added to your cart!`);
}

  
</script>
