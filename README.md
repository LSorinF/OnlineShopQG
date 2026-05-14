# OnlineShopQG

# E-Commerce Clothing Shop

This project is a full-stack e-commerce application built with **.NET (C#)** for the backend and **Angular** for the frontend. This document explains the steps required to configure, build, and run the application in a local environment.

---

##  Prerequisites

For the application ensure you have the following software installed on your machine:

*   [.NET SDK](https://dotnet.microsoft.com/download) (version 6.0 or newer)
*   [Node.js and npm](https://nodejs.org/) (LTS version recommended)
*   [Angular CLI](https://angular.io/cli) (installed globally by running `npm install -g @angular/cli`)
*   [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express) and SQL Server Management Studio (SSMS)


## Step 1: Set up the Database

Since this project uses ADO.NET, you need to execute the provided SQL script to create the database schema and populate the initial data.

1. Open **SQL Server Management Studio (SSMS)** and connect to your local server.
2. Open the `SQLScripts.sql` file (located in the Utils folder) in OnlineShopQG.Server and run the scripts.
3. The database and the tables will be created, and the initial products will be populated automatically.

---

## Step 2: Configure and Run the Backend (.NET)

The backend provides the API necessary to process authentication, products, and shopping cart operations.

1. Open a terminal and navigate to the backend folder (`cd OnlineShopQG.Server`).
2. Open the `appsettings.json` file and check the `ConnectionStrings` section. Ensure the Server and Database name match your local configuration.
3. Restore the NuGet packages by running the following command: **dotnet restore**
4. Build and Start the server: **dotnet run**
5. The API will start and usually run on `https://localhost:7281`

## Step 3: Configure and Run the Frontend (Angular)

The frontend represents the visual interface of the shop.

1. Open a new terminal (keeping the backend terminal open) and navigate to the frontend folder (`cd onlineshopqg.client`).
2. Install all Node.js dependencies by running the command: **npm install**
3. Once the installation is complete, start the Angular development server with: **ng serve**
4. Open your browser and navigate to: `https://localhost:57131`.

---

##  Step 4: Run the Tests

If you want to run automated tests to check the application's stability you need to have the Solution running:

1. Open a terminal in the onlineshopqg.client directory and run: **npx cypress open**
2. On the Cypress UI select E2E testing
3. Then select Chrome and press Start E2E Testing
4. Select Frontend.cy.ts to test the UI
5. Select Backend.cy.ts to test the APIs


