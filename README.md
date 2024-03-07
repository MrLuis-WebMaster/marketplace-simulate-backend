
# Marketplace

A simulated marketplace.

## Run Locally

Clone the project

```bash
  git clone https://github.com/MrLuis-WebMaster/marketplace-simulate-backend
```

Go to the project directory

```bash
  cd marketplace-simulate-backend
```

Install dependencies

```bash
  npm install
```
Copy the .env.template file to create a new .env file and add the necessary environment variable values.

Open the .env file and add the corresponding values.


Start the server prod mode

```bash
  npm start
```
Start the server dev mode

```bash
  npm run dev
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

To run tests coverage, run the following command

```bash
  npm run test:coverage
```
## Technologies Used

- Node.js
- Express.js
- TypeScript
- Vitest (for testing with Vitest mock)
- Postgres
- Sequelize
- jsonwebtoken
- Zod
- Swagger
- Railway (Deployment)
- Other relevant technologies used in your project

## API Documentation
For detailed API documentation, refer to the OpenAPI documentation available at:

[API Documentation](https://marketplace-simulate-backend-production.up.railway.app/docs/)


## Live Demo
Explore the live demo of the marketplace application at:

[DEMO](https://marketplace-simulate-frontend.vercel.app/)

## User Credentials (Live Demo)

### Admin User
- Email: admin@example.com
- Password: Admin123,
- Role: ADMIN

### Seller User
- Email: seller@example.com
- Password: Seller1234,
- Role: SELLER

### Customer User
- Email: customer@example.com
- Password: Customer123,
- Role: CUSTOMER