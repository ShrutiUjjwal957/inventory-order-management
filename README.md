# Inventory & Order Management System

A full-stack application for managing products, customers, orders, and inventory tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python + FastAPI |
| Frontend | React |
| Database | PostgreSQL |
| Containerization | Docker + Docker Compose |

## Features

- **Product Management** — CRUD operations with unique SKU enforcement
- **Customer Management** — Create/view/delete customers with unique email validation
- **Order Management** — Create orders with automatic inventory reduction and stock validation
- **Dashboard** — Summary stats with low-stock product alerts
- **Responsive UI** — Mobile-friendly React interface

## Quick Start (Docker)

```bash
# Clone the repository
git clone <your-repo-url>
cd inventory-order-management

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## Running Locally (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variable
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /products/ | Create a product |
| GET | /products/ | List all products |
| GET | /products/{id} | Get product by ID |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers/ | Create a customer |
| GET | /customers/ | List all customers |
| GET | /customers/{id} | Get customer by ID |
| DELETE | /customers/{id} | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders/ | Create an order |
| GET | /orders/ | List all orders |
| GET | /orders/{id} | Get order by ID |
| DELETE | /orders/{id} | Delete/cancel order |

## Business Rules

1. Product SKU must be unique
2. Customer email must be unique
3. Product quantity cannot be negative
4. Orders cannot be placed if inventory is insufficient
5. Creating an order automatically reduces available stock
6. Total order amount is calculated automatically by the backend

## Deployment

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `CORS_ORIGINS` — your frontend deployment URL

### Frontend (Vercel)

1. Import your repository on [Vercel](https://vercel.com)
2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
3. Add environment variable:
   - `REACT_APP_API_URL` — your backend deployment URL

### Database (Render/Railway)

- Use Render PostgreSQL or Railway PostgreSQL (free tier)
- Copy the connection string to your backend environment variables

### Docker Hub

```bash
# Build and push backend image
docker build -t yourusername/inventory-backend ./backend
docker push yourusername/inventory-backend

# Build and push frontend image
docker build -t yourusername/inventory-frontend ./frontend
docker push yourusername/inventory-frontend
```

## Project Structure

```
inventory-order-management/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Settings / env configuration
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── routers/
│   │       ├── products.py  # Product CRUD endpoints
│   │       ├── customers.py # Customer CRUD endpoints
│   │       └── orders.py    # Order endpoints with business logic
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Products.js
│   │   │   ├── Customers.js
│   │   │   └── Orders.js
│   │   └── services/
│   │       └── api.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | inventory_db |
| `POSTGRES_USER` | Database user | postgres |
| `POSTGRES_PASSWORD` | Database password | (set in .env) |
| `DATABASE_URL` | Full DB connection string | — |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | http://localhost:3000 |
| `REACT_APP_API_URL` | Backend API URL for frontend | http://localhost:8000 |
