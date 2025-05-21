# Node.js Crypto/Payments Hexagonal Architecture Solution

This project is a Node.js/TypeScript application designed to process cryptocurrency deposit transactions, following a **hexagonal architecture** (ports and adapters). It uses PostgreSQL for persistence, Docker for containerization, and includes dependency injection via `tsyringe` for testability and modularity.

---

## Features

- **Hexagonal Architecture**: Clear separation of domain, application, infrastructure, and interface layers.
- **SOLID Principles**: Each service and calculator has a single responsibility and is easily testable.
- **Dependency Injection**: Uses `tsyringe` for IoC, making it easy to swap implementations and mock dependencies in tests.
- **Transaction Processing**: Reads transactions from JSON files or the database, validates them, and summarizes deposits.
- **Deposit Calculators**: Extensible strategy pattern for:
  - Sum/count by customer
  - Smallest deposit
  - Largest deposit
  - Deposits without reference
- **Unit Testing**: Jest tests for all business logic and calculators.
- **Dockerized**: Ready for local or production deployment with Docker and Docker Compose.

---

## Project Structure

```
node-crypto-payments-challenge-v1
├── src
│   ├── application
│   │   └── services
│   │       ├── DepositService.ts
│   │       ├── DepositCalculatorsStrategy.ts
│   │       └── ...
│   ├── domain
│   │   ├── entities
│   │   │   └── Transaction.ts
│   │   └── repositories
│   │       └── TransactionRepositoryInterface.ts
│   ├── infrastructure
│   │   ├── database
│   │   │   └── TransactionRepositoryTypeORM.ts
│   │   ├── files
│   │   │   ├── transactions-1.json
│   │   │   └── transactions-2.json
│   │   └── ioc
│   │       └── container.ts
│   ├── interfaces
│   │   ├── controllers
│   │   │   └── DepositController.ts
│   │   └── cron
│   │       └── PeriodicProcessor.ts
│   └── config
│       └── customer-addresses.json
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup Instructions

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd node-crypto-payments-challenge-v1
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Build the Docker image**:
   ```sh
   docker build -t crypto-payments-app .
   ```

4. **Run the application with Docker Compose**:
   ```sh
   docker-compose up
   ```

5. **Access the application**:  
   The application will be accessible at `http://localhost:<port>` (see `docker-compose.yml` for the port).

---

## Usage

- The application processes transactions from the provided JSON files in `src/infrastructure/files/` or from the database.
- Deposit summaries are printed to the console and can be accessed via the API controller.
- You can schedule periodic processing using the cron-based `PeriodicProcessor`.

---

## Testing

- **Run all tests**:
  ```sh
  npx jest
  ```
- **Run only failed tests**:
  ```sh
  npx jest --onlyFailures
  ```
- **View coverage**:
  ```sh
  npx jest --coverage
  ```

---

## Extending the Solution

- **Add new deposit calculation strategies** by implementing the `DepositCalculator` interface and registering them in `DepositService`.
- **Swap infrastructure** (e.g., use another database) by implementing the repository interface and updating the IoC container registration.
- **Add new controllers or CLI interfaces** in the `interfaces` layer.

---

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Dependencies Overview

Below is a summary of the main dependencies defined in [`package.json`](package.json), their purpose, and how they are used in this project:

| Dependency            | Purpose                                                                 | Usage in Project                                                                                 |
|-----------------------|-------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **typescript**        | TypeScript compiler for static typing and transpilation                  | All source code is written in TypeScript and compiled before running or testing                  |
| **ts-node**           | Run TypeScript files directly without pre-compiling                      | Used for development scripts and running TypeScript entrypoints                                  |
| **tsyringe**          | Dependency Injection (IoC) container for TypeScript                     | Used to inject repositories and services, enabling loose coupling and testability                |
| **class-transformer** | Utility to transform plain objects to class instances and vice versa     | Used to map database/query results to domain entities like `Transaction`                         |
| **reflect-metadata**  | Enables decorators and metadata reflection (required by tsyringe, etc.)  | Required for dependency injection and class-transformer to work with decorators                  |
| **typeorm**           | ORM for TypeScript/JavaScript and relational databases                   | Used for database access, mapping entities, and repository implementations                       |
| **pg**                | PostgreSQL client for Node.js                                            | Used by TypeORM to connect and interact with the PostgreSQL database                             |
| **node-cron**         | Cron-like job scheduling for Node.js                                     | Used to schedule periodic processing of transactions (see `PeriodicProcessor`)                   |
| **jest**              | JavaScript/TypeScript testing framework                                  | Used for all unit and integration tests in the project                                           |
| **ts-jest**           | Jest preprocessor for TypeScript                                         | Allows Jest to run TypeScript test files directly                                                |
| **@types/\***         | TypeScript type definitions for various libraries                        | Provides type safety and autocompletion for dependencies like Node.js, Jest, pg, etc.            |
| **dotenv**            | Loads environment variables from `.env` files                            | Used to configure environment-specific settings (e.g., DB connection, cron expressions)          |

### How dependencies are used

- **Dependency Injection:**  
  `tsyringe` is used to inject implementations (e.g., repositories) into services and controllers. See [`src/infrastructure/ioc/container.ts`](src/infrastructure/ioc/container.ts) for registration.

- **Database Access:**  
  `typeorm` and `pg` are used for all database operations. Entities are defined in [`src/domain/entities/`](src/domain/entities/) and repositories in [`src/infrastructure/database/`](src/infrastructure/database/).

- **Object Mapping:**  
  `class-transformer` is used to convert raw database results into domain entities, ensuring type safety and consistency.

- **Scheduling:**  
  `node-cron` is used in [`src/interfaces/cron/PeriodicProcessor.ts`](src/interfaces/cron/PeriodicProcessor.ts) to schedule periodic transaction processing.

- **Testing:**  
  `jest`, `ts-jest`, and related `@types` packages are used for all automated tests. See the [Testing](#testing) section for usage.

- **Environment Configuration:**  
  `dotenv` is used to load environment variables for configuration, such as database credentials and cron schedules.

---