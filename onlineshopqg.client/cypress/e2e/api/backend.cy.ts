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
      failOnStatusCode: false // This allows the test to pass even with the 405 error
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
      expect(response.body).to.have.property('user');
    });
  });

  it('API Test 5: Verify POST /api/Auth/login rejects bad passwords (401 Unauthorized)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/Auth/login`,
      failOnStatusCode: false, // Don't crash on error
      body: {
        email: 'smartbuyer_16843@example.com',
        password: 'WrongPassword999!'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401]);
    });
  });

});


describe('API Test 6: Backend API Tests - Auth Controller', () => {
  const baseUrl = 'https://localhost:7281/api/Auth';

  // Ensure the email is unique every time
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  let userId: number;
  let token: string;

  //REGISTER
  it('API Test 7: Verify User Registration', () => {
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
      expect(response.body).to.have.property('email', uniqueEmail);
    });
  });

  // LOGIN
  it('API Test 8: Verify User Login and Token Generation', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        email: uniqueEmail,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      userId = response.body.id;
      token = response.body.token;

      expect(token).to.not.be.empty;
      expect(userId).to.be.a('number');
    });
  });

  //------- GET /api/Auth/{id} -------

  it('API Test 9: Verify Get User Details by ID', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${userId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(uniqueEmail);
      expect(response.body.name).to.include('Test Automation');
    });
  });


  // ------------  PUT /api/Auth/{id}  ----------

  it('API Test 10: Verify Update User Profile', () => {
    const updatedName = 'Updated Automation Name';

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/${userId}`,
      body: {
        id: userId,
        name: updatedName,
        email: uniqueEmail 
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      if (response.status === 200) {
        expect(response.body.name).to.eq(updatedName);
      }
    });
  });
});

