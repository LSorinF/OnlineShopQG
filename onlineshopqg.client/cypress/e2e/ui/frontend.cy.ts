describe('Authentication Flow Tests', () => {

  const uniqueEmail = `newuser_${Math.random()}@example.com`;
  const validPassword = 'SecurePassword123!';
  const existingEmail = 'Sorin@gmail.com';
  const existingPassword = 'Sorin1!'

    it('Test Case 1: Register User', () => {
      // Go to register page
      cy.visit('https://localhost:57131/register');

      cy.get('input[name="name"]').type('James Smith');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.get('input[name="addressLine"]').type('Wilson 24 Street');
      cy.get('input[name="city"]').type('Baltimore');
      cy.get('input[name="state"]').type('Maryland');
      cy.get('input[name="zipCode"]').type('378433');
      cy.get('input[name="country"]').type('America');
      cy.get('input[name="phoneNumber"]').type('2257135076');

      // Click register
      cy.contains('button', 'Register', { matchCase: false }).click();

      cy.url().should('include', '/login');
    });


    it('Test Case 2: Login User with correct email and password', () => {
      cy.visit('https://localhost:57131//login');

      cy.get('input[type="email"]').type(uniqueEmail);
      cy.get('input[type="password"]').type(validPassword);

      // Click Login
      cy.contains('button', 'Login', { matchCase: false }).click();

      cy.url().should('eq', 'https://localhost:57131/');

      cy.contains('Logout').should('be.visible');
    });


    it('Test Case 3: Login User with incorrect email and password', () => {
      cy.visit('https://localhost:57131/login');

      // Fill in wrong data
      cy.get('input[name="email"]').type('wrong_email@example.com');
      cy.get('input[name="password"]').type('WrongPassword123!');


      // Check for invalid message
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.contains('Invalid username or password');
      });

      //Press login
      cy.contains('button', 'Login', { matchCase: false }).click();

      // check URL
      cy.url().should('include', '/login');
    });


    it('Test Case 4: Logout User', () => {
      // Log in
      cy.visit('https://localhost:57131/login');
      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(existingPassword);
      cy.contains('button', 'Login', { matchCase: false }).click();

      //Press logout
      cy.contains('Logout', { matchCase: false }).click();

      cy.url().should('include', '/login');
    });


    it('Test Case 5: Register User with existing email', () => {
      cy.visit('https://localhost:57131/register');

      // Fill in an existing email
      cy.get('input[name="name"]').type('James Smith');
      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.get('input[name="addressLine"]').type('Wilson 24 Street');
      cy.get('input[name="city"]').type('Baltimore');
      cy.get('input[name="state"]').type('Maryland');
      cy.get('input[name="zipCode"]').type('378433');
      cy.get('input[name="country"]').type('America');
      cy.get('input[name="phoneNumber"]').type('2257135076');

      cy.contains('button', 'Register', { matchCase: false }).click();

      //Check for err message
      cy.contains('User already exists.', { matchCase: false }).should('be.visible');

      // Check we're still on Register page
      cy.url().should('include', '/register');
    });

  it('Test Case 6: Verify All Products and product detail page', () => {

      cy.visit('https://localhost:57131/');

      cy.get('.product-grid').should('exist');
      cy.get('.product-card').should('have.length.greaterThan', 0);

      // Check that the first product has an image, price, and name rendered
      cy.get('.product-card').first().within(() => {
        cy.get('.card-image-box').should('be.visible');
        cy.get('h3.mb-10').should('contain.text', 'RON');
        cy.get('.btn-purple').should('contain.text', 'Add to cart');
      });

      cy.get('.product-card').first().find('.product-name').invoke('text').then((productName) => {

        // Find the "View Product" link
        cy.get('.product-card').first().contains('a', 'View Product').click();

        // Verify the URL changed to the product details route
        cy.url().should('include', '/product/');

        // Verify the details page shows the exact same product name we clicked on
        cy.get('h1.title-purple').should('contain.text', productName.trim());
        cy.contains('h2', 'RON').should('be.visible');
        cy.get('p').should('not.be.empty');
      });
    });


    it('Test Case 7: Search Product', () => {
 
      cy.visit('https://localhost:57131/products');

      const searchTerm = 'Dino';

      cy.get('input[placeholder*="Search"]').type(`${searchTerm}{enter}`);

      //Verify that the product grid exists and is populated with results
      cy.get('.product-grid').should('exist');
      cy.get('.product-card').should('have.length.greaterThan', 0);

      cy.get('.product-card').each(($card) => {
        cy.wrap($card).find('.product-name').invoke('text').then((productName) => {
          expect(productName.toLowerCase()).to.include(searchTerm.toLowerCase());
        });
      });

      // Negative Test
      cy.get('input[placeholder*="Search"]').clear().type('dfghcc{enter}');

      // Verify that no product cards are shown
      cy.get('.product-card').should('not.exist');
      cy.contains('No products found', { matchCase: false }).should('be.visible');
    });


    it('Test Case 8: Add Products in Cart and Verify Cart States', () => {

      cy.visit('https://localhost:57131/cart');

      cy.get('.empty-cart-box').should('be.visible');
      cy.contains('h3', 'Your cart is empty!').should('be.visible');

      cy.contains('button', 'Return to Shop').click();
      cy.url().should('not.include', '/cart');

      //Ensure it is logged in
      cy.visit('https://localhost:57131/login');

      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(existingPassword);

      cy.contains('button', 'Login', { matchCase: false }).click();

      // Add an item to cart
      cy.get('.product-card').first().within(() => {

        cy.get('.product-name').then(($nameElement) => {
          const cleanProductName = $nameElement.text().trim();
          cy.wrap(cleanProductName).as('addedProductName');
        });

        cy.get('.btn-purple').contains('Add to cart', { matchCase: true }).click();
      });

      // VERIFY POPULATED CART
      cy.visit('https://localhost:57131/cart');

      cy.get('.empty-cart-box').should('not.exist');
      cy.get('.shop-table').should('be.visible');

      cy.get('@addedProductName').then((productName) => {

        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(0).find('strong').should('contain.text', `${productName}`);

          cy.get('td').eq(1).should('contain.text', 'RON');
          cy.get('td').eq(2).should('contain.text', '1');
          cy.get('td').eq(3).should('contain.text', 'RON');
        });
      });

      cy.get('.cart-summary').should('be.visible');
      cy.get('.cart-summary h3').should('contain.text', 'Total:');
      cy.get('.cart-summary h3').should('contain.text', 'RON');
      cy.contains('button', 'Proceed to Checkout').should('be.visible');

      //Test Remove functionality
      cy.get('.btn-remove').click();

      cy.get('.shop-table').should('not.exist');
      cy.get('.empty-cart-box').should('be.visible');
    });

    it('Test Case 9: Verify Product quantity in Cart and Subtotal calculation', () => {

      cy.visit('https://localhost:57131/login');

      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(existingPassword);

      cy.contains('button', 'Login', { matchCase: false }).click();

      cy.get('.product-card').first().within(() => {
        cy.get('.product-name').then(($name) => {
          cy.wrap($name.text().trim()).as('targetProduct');
        });

        // Extract the price and convert to number
        cy.get('h3.mb-10').then(($priceElement) => {
          const priceString = $priceElement.text().replace('RON', '').trim();
          cy.wrap(Number(priceString)).as('unitPrice');
        });

        // Add to cart
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      //Verify that quantity is 1
      cy.visit('https://localhost:57131/cart');

      cy.get('.shop-table tbody tr').first().within(() => {
        // Check Quantity = 1
        cy.get('td').eq(2).should('contain.text', '1');
      });

      //extract same item again
      cy.visit('https://localhost:57131/');

      cy.get('.product-card').first().within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      // Quantity 2?
      cy.visit('https://localhost:57131/cart');

      // Retrieve the unit price
      cy.get('@unitPrice').then((unitPrice) => {

        const price = unitPrice as unknown as number;
        const expectedSubtotal = price * 2;

        cy.get('.shop-table tbody tr').first().within(() => {
          // Verify that quantity is 2
          cy.get('td').eq(2).should('have.text', '2');

          // Verify that price x2
          cy.get('td').eq(3).should('contain.text', `${expectedSubtotal} RON`);
        });
      });
    });


    it('Test Case 10: Place Order: Register before Checkout', () => {

      const uniqueEmail = `newuser_${Math.random()}@example.com`;

      // Register and Authenticate first
      cy.visit('https://localhost:57131/register');

      cy.intercept('POST', 'https://localhost:7281/api/auth/register').as('registerRequest');
      cy.intercept('POST', 'https://localhost:7281/api/auth/login').as('loginRequest');

      cy.get('input[name="name"]').type('Patrunjel Anabella');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.get('input[name="addressLine"]').type('100 Pre-Registered Blvd');
      cy.get('input[name="city"]').type('Bucharest');
      cy.get('input[name="state"]').type('Ilfov');
      cy.get('input[name="zipCode"]').type('010101');
      cy.get('input[name="country"]').type('Romania');
      cy.get('input[name="phoneNumber"]').type('0722000000');

      cy.contains('button', 'Register', { matchCase: false }).click();

      //Wait to be registered
      cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);


      //Go to login
      cy.visit('https://localhost:57131/login');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.contains('button', 'Login', { matchCase: false }).click();


      //Wait to be logged in
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

      // Go to shop
      cy.visit('https://localhost:57131/');

      // Add the first available product to the cart
      cy.get('.product-card').first().within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      //Go to Cart
      cy.visit('https://localhost:57131/cart');

      cy.get('.shop-table').should('be.visible');
      cy.contains('button', 'Proceed to Checkout').click();

      //CHECKOUT

      cy.url().should('include', '/checkout');

      cy.get('.billing-details').should('be.visible');

      // Verify the is correctly filled
      cy.get('.billing-details').should('contain.text', 'Patrunjel Anabella');
      cy.get('.billing-details').should('contain.text', '100 Pre-Registered Blvd');
      cy.get('.billing-details').should('contain.text', 'Bucharest');

      // Check that the order summary
      cy.get('.card-summary').within(() => {
        cy.get('.checkout-item').should('have.length.greaterThan', 0);
      });

      // Place order
      cy.contains('button', 'Place Order').should('not.be.disabled').click();

      // Verify the order was placed successfully
      cy.url().should('not.include', '/checkout');
    });


    it('Test Case 11: Place Order: Login before Checkout', () => {

      const existingEmail = 'Sorin@gmail.com';
      const validPassword = 'Sorin1!';

      cy.visit('https://localhost:57131/');

      // Try to add a product to the cart without being logged in
      cy.get('.product-card').first().within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      cy.contains('Please log in to add items to your cart!', { matchCase: false }).should('be.visible');


      //Authenticate
      cy.visit('https://localhost:57131/login');

      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.contains('button', 'Login', { matchCase: false }).click();

      // Ensure login was successful
      cy.url().should('not.include', '/login');

      cy.visit('https://localhost:57131/');

      // Add the first available product
      cy.get('.product-card').first().within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      // Go to the cart page
      cy.visit('https://localhost:57131/cart');

      cy.get('.shop-table').should('be.visible');
      cy.contains('button', 'Proceed to Checkout').click();

      cy.url().should('include', '/checkout');

      // Billing details visible
      cy.get('.billing-details').should('be.visible');

      cy.get('.card-summary').within(() => {
        cy.get('.checkout-item').should('have.length.greaterThan', 0);
      });

      // Place order
      cy.contains('button', 'Place Order').should('not.be.disabled').click();

      cy.contains('Order placed successfully', { matchCase: false }).should('be.visible');
    });


    it('Test Case 12: Remove Products From Cart', () => {

      const existingEmail = 'Sorin@gmail.com';
        const validPassword = 'Sorin1!';

      cy.visit('https://localhost:57131/login');

      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.contains('button', 'Login', { matchCase: false }).click();

      cy.url().should('not.include', '/login');

      cy.visit('https://localhost:57131/');

      // Add the first product to the cart
      cy.get('.product-card').eq(0).within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      // Add the second product to the cart
      cy.get('.product-card').eq(1).within(() => {
        cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
      });

      // Navigate to the cart
      cy.visit('https://localhost:57131/cart');

      // Verify the table exists and contains exactly 2 rows
      cy.get('.shop-table').should('be.visible');
      cy.get('.shop-table tbody tr').should('have.length', 2);

      cy.get('.shop-table tbody tr').first().within(() => {
        cy.get('.btn-remove').click();
      });

      cy.get('.shop-table tbody tr').should('have.length', 1);

      // Click "remove"
      cy.get('.shop-table tbody tr').first().within(() => {
        cy.get('.btn-remove').click();
      });

      // Verify that there's no more products
      cy.get('.shop-table').should('not.exist');
      cy.get('.cart-summary').should('not.exist');

      cy.get('.empty-cart-box').should('be.visible');
      cy.contains('h3', 'Your cart is empty!').should('be.visible');
      cy.contains('button', 'Return to Shop').should('be.visible');
    });


    it('Test Case 13: View Category Products', () => {

      cy.visit('https://localhost:57131/');

      cy.get('.sidebar-list').should('be.visible');

      // Select the second opotion (MEN)
      cy.get('.sidebar-list .sidebar-item').eq(1).click();

      cy.get('.product-grid').should('be.visible');

      // Verify that men product is there
      cy.contains('.product-card', 'White Oxford Shirt', { matchCase: false })
        .should('exist')
        .and('be.visible');

      // Verify that women dress is not there
      cy.contains('.product-card', 'Velvet Night Dress', { matchCase: false })
        .should('not.exist');

      // Verify that kids product doesn't exist
      cy.contains('.product-card', 'Dino-Purple Pajamas', { matchCase: false })
        .should('not.exist');
    });


    it('Test Case 14: Verify Navbar updates after Login and handles Logout', () => {

      const existingEmail = 'Sorin@gmail.com'
      const existingPassword = 'Sorin1!'

      //Verify guest main page
      cy.visit('https://localhost:57131/')
      cy.contains('a', 'Login').should('exist');
      cy.contains('a', 'Register').should('exist');


      // Log in the user
      cy.visit('https://localhost:57131/login');
      cy.get('input[name="email"]').type(existingEmail);
      cy.get('input[name="password"]').type(existingPassword);
      cy.contains('button', 'Login').click();

      cy.get('nav').within(() => {
        // The login/register links should be hidden
        cy.contains('a', 'Login').should('not.exist');
        cy.contains('a', 'Register').should('not.exist');

        cy.contains(`Hello, Sorin!`).should('be.visible');
        cy.contains('a', 'Logout').should('be.visible').click();
      });

      cy.get('nav').within(() => {
        cy.contains('a', 'Login').should('be.visible');
        cy.contains('Hello,').should('not.exist');
      });
    });


  it('Test Case 14: Change shipping details.', () => {

    const uniqueEmail = `newuser_${Math.random()}@example.com`;
    const anyPassword = 'Test123!'
    const randomAddress = `strada zambilelor nr. ${Math.random()}`;

    // Register and Authenticate first
    cy.visit('https://localhost:57131/register');

    cy.intercept('POST', 'https://localhost:7281/api/auth/register').as('registerRequest');
    cy.intercept('POST', 'https://localhost:7281/api/auth/login').as('loginRequest');

    // Fill out the registration form with complete details
    cy.get('input[name="name"]').type('Patrunjel Anabella');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(anyPassword);
    cy.get('input[name="addressLine"]').type('100 Pre-Registered Blvd');
    cy.get('input[name="city"]').type('Bucharest');
    cy.get('input[name="state"]').type('Ilfov');
    cy.get('input[name="zipCode"]').type('010101');
    cy.get('input[name="country"]').type('Romania');
    cy.get('input[name="phoneNumber"]').type('0722000000');

    cy.contains('button', 'Register', { matchCase: false }).click();

    //Wait to be registered
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);


    //Go to login
    cy.visit('https://localhost:57131/login');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(anyPassword);
    cy.contains('button', 'Login', { matchCase: false }).click();


    //Wait to be logged in
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.visit('https://localhost:57131/');

    cy.get('.product-card').first().within(() => {
      cy.get('.btn-purple').contains('Add to cart', { matchCase: false }).click();
    });

    cy.visit('https://localhost:57131/cart');

    cy.get('.shop-table').should('be.visible');
    cy.contains('button', 'Proceed to Checkout').click();

    //CHECKOUT

    cy.url().should('include', '/checkout');

    // Verify view mode is visible
    cy.get('.billing-details').should('be.visible');

    cy.contains('button', 'Edit Shipping Details', { matchCase: false }).click();

    cy.get('input[name="addressLine"]')
      .should('be.visible')
      .clear()
      .type(randomAddress);

    cy.get('.btn-purple').contains('Save Address', { matchCase: false }).click();

    cy.get('.edit-form').should('not.exist');
    cy.get('.billing-details').should('contain', randomAddress);
  });
});
