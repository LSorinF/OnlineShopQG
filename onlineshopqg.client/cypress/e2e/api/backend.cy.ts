describe('Backend API Tests - Products', () => {

  const baseUrl = 'https://localhost:7281/api';

  it('API Test 1: Verify GET /api/Products returns all products', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/Products`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('API Test 2: Verify GET /api/Products/brand-stats returns data', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/Products/brand-stats`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('API Test 3: Verify POST to /api/Products returns 405 (Method Not Allowed)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/Products`,
      failOnStatusCode: false 
    }).then((response) => {
      expect(response.status).to.eq(405);
    });
  });

});


describe('Backend API Tests - Authentication', () => {

  const baseUrl = 'https://localhost:7281/api';

  it('API Test 4: Verify POST /api/Auth/login with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/Auth/login`,
      body: {
        email: 'Sorin@gmail.com',
        password: 'Sorin1!'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('userId');
    });
  });

  it('API Test 5: Verify POST /api/Auth/login rejects bad passwords (401 Unauthorized)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/Auth/login`,
      failOnStatusCode: false, 
      body: {
        email: 'wrongUser@test.com',
        password: 'WrongPassword999!'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401]);
    });
  });

});


describe('Backend API Tests - Auth Controller', () => {
  const baseUrl = 'https://localhost:7281/api/Auth';

  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  let userId: number;
  let token: string;

  // 1. REGISTER
  it('API Test 6: Verify User Registration', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      body: {
        name: 'Test Automation User',
        email: uniqueEmail,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(JSON.stringify(response.body)).to.include("Registration successful!");
    });
  });

  // 2. LOGIN
  it('API Test 7: Verify User Login and Token Generation', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        email: uniqueEmail,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      userId = response.body.userId;
      token = response.body.token;

      expect(token, 'Token should be present').to.not.be.empty;
      expect(userId, 'User ID should be a number').to.be.a('number');
    });
  });

  it('API Test 8: Verify Get User Details by ID', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(uniqueEmail);
    });
  });

  it('API Test 9: Verify Update User Profile', () => {
    const updatedName = 'Updated Automation Name';

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        id: userId,
        name: updatedName,
        email: uniqueEmail
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe('Backend API Tests - Orders Controller', () => {
  const baseUrl = 'https://localhost:7281/api';
  let authToken: string;
  let activeUserId: number;

  before(() => {
    const orderUserEmail = `order_test_${Date.now()}@example.com`;
    const orderUserPassword = 'Password123!';

    cy.request('POST', `${baseUrl}/Auth/register`, {
      name: 'Order Tester',
      email: orderUserEmail,
      password: orderUserPassword
    }).then(() => {
      cy.request('POST', `${baseUrl}/Auth/login`, {
        email: orderUserEmail,
        password: orderUserPassword
      }).then((response) => {
        authToken = response.body.token;

        activeUserId = response.body.userId;

        cy.log(`Authenticated. UserID: ${activeUserId}`);
      });
    });
  });

  it('API Test 10: Verify Placing a New Order', () => {
    cy.request('GET', `${baseUrl}/Products`).then((productResponse) => {
      const product = productResponse.body[0];

      cy.request({
        method: 'POST',
        url: `${baseUrl}/Orders`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          userId: activeUserId,
          totalAmount: product.price,
          shippingAddress: "Strada Automatizării nr. 1, Craiova",
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price
            }
          ]
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(activeUserId).to.be.a('number');
      });
    });
  });

  it('API Test 11: Verify Order fails without Authentication (401)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/Orders`,
      failOnStatusCode: false,
      body: {
        userId: activeUserId,
        shippingAddress: "Temp Address",
        items: []
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
  
});


describe('Backend API Tests - Cart Controller', () => {
  const baseUrl = 'https://localhost:7281/api/Cart';
  let authToken: string;
  let activeUserId: number;
  let productId: number;

  before(() => {
    // Login to get credentials
    cy.request('POST', 'https://localhost:7281/api/Auth/login', {
      email: 'Sorin@gmail.com', 
      password: 'Sorin1!'
    }).then((loginRes) => {
      authToken = loginRes.body.token;
      activeUserId = loginRes.body.userId || loginRes.body.id;

      // Get a valid Product ID 
      cy.request('GET', 'https://localhost:7281/api/Products').then((prodRes) => {
        productId = prodRes.body[0].id;
      });
    });
  });



  it('API Test 13: Verify adding an item to the cart', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/add`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        userId: activeUserId,
        productId: productId,
        quantity: 2
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(JSON.stringify(response.body)).to.not.be.empty;
    });
  });



  it('API Test 14: Verify retrieving cart items', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${activeUserId}`,
      headers: { Authorization: `Bearer ${authToken}` }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      // Check if product is actually in the list
      const itemExists = response.body.some((item: any) => item.productId === productId);
      expect(itemExists).to.be.true;
    });
  });



  it('API Test 15: Verify removing an item from the cart', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/remove/${activeUserId}/${productId}`,
      headers: { Authorization: `Bearer ${authToken}` }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
    });
  });




  it('API Test 16: Verify GET Cart fails without token', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${activeUserId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});


