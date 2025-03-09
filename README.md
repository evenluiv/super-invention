# Pipedrive API Proxy
This repository contains a simple application that forwards requests to the Pipedrive API. The project is implemented in TypeScript.

## Features
#### Implements three endpoints:

* `GET /deals` – Fetch all deals from Pipedrive.
* `POST /deals` – Create a new deal in Pipedrive.
* `PUT /deals` – Update an existing deal in Pipedrive.
#### Logs all requests and responses in a structured format.
#### Includes a `GET /metrics` endpoint to track request duration and latency in the server.
#### Implements CI/CD pipelines using GitHub Actions:
* CI: Runs tests and linting on every pull request commit.
* CD: Logs "Deployed!" when a pull request is merged to `main`.
#### Dockerized for easy local setup.

## Installation & Running Locally

### Prequisites
* Docker
* API token for Pipedrive API

### Steps

#### 1. Clone Repository:
```
git clone https://github.com/evenluiv/super-invention.git
cd super-invention
```

#### 2. Set up environment variables:
```
cp .env.example .env
```

#### 3. Run Docker:
```
docker compose up -d
```
To power down the container use:
```
docker compose down
```
## My task logging:

### Pipedrive DevOps Test Task logging

#### DAY 1 19.02.2025:

* Testing the api with Postman.
* Started with the get, post, put requests.
* Made first endpoint with GET deals.

#### DAY 2 21.02.2025:

* Made second endpoint with POST-ing deals.
* Made final endpoint with PUT for updating a deal.
* Wrote tests for requests.

#### DAY 3 22.02.2025:

* Started Task 2 with metrics logging.
* Made console logging middleware for requests.

#### DAY 4 24.02.2025:

* Started CI task.
* Made / tested test-on-commit workflow.
* Started CD task.
* Made / tested merged to master workflow.
* Restructured repo.

#### DAY 5 25.02.2025:

* Made Dockerfile and docker-compose.yml for easy reproducibility.

## Endpoints
| Method      | Endpoint    | Description                        |
| ----------- | ----------- | ---------------------------------- |
| GET         | `/deals`    | Fetch all deals                    |
| POST        | `/deals`    | Add a new deal                     |
| PUT         | `/deals`    | Update an existing deal            |
| GET         | `/metrics`  | Retrieve request metrics on server |

## Logging

Everyting that happens with the endpoints is logged to the console in a clean way using `console.log()` for simplicity.

## CI/CD Setup

### Continuous Integration (CI)

Runs tests and linting using GitHub Actions for every commit pushed to a pull request.

### Continuous Deployment (CD)

On merging a pull request to master, logs "Deployed!".

## Testing

Run tests with:
```
npm test
```
Run linting with:
```
npm run lint
```

## Technolgies used

### This project is built using the following technologies:

* #### Runtime & Frameworks
    * Node.js – JavaScript runtime
    * Express - Web framework for Node.js to easily build API
* #### Development & Tooling
    * TypeScript – Strongly typed JavaScript
    * ts-node – TypeScript execution environment
    * ESLint – Linter for maintaining code quality
    * dotenv – Environment variable management
* #### Testing
    * Jest – easy and simple JavaScript testing framework
    * Supertest – HTTP assertions for API testing
    * Nock – Mock HTTP requests for testing
    * Postman – API testing and debugging
* #### Build & CI/CD
    * TypeScript Compiler (tsc) – Compiles TypeScript to JavaScript
    * GitHub Actions – CI/CD pipeline

## Author

- [@evenluiv](https://github.com/evenluiv)
