# 🛍️ SmartShop AI — Intelligent Shopping Agent

> **Shop Smarter. Compare Better. Buy Confidently.**

A complete, modern, full-stack AI-powered shopping assistant built with **React.js**, **Node.js**, **MySQL**, **IBM Granite Models**, and **RAG architecture**.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Database Setup](#database-setup)
7. [Environment Configuration](#environment-configuration)
8. [Running the Application](#running-the-application)
9. [IBM watsonx.ai Configuration](#ibm-watsonxai-configuration)
10. [LangFlow / LangChain Setup](#langflow--langchain-setup)
11. [API Endpoints](#api-endpoints)
12. [Demo Mode](#demo-mode)
13. [Pages Overview](#pages-overview)
14. [Architecture](#architecture)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Shopping Assistant | IBM Granite-powered chat with RAG retrieval |
| 🔍 Multimodal Search | Text, image upload, and voice search |
| 🛍️ Product Discovery | Filter, sort, and browse 22+ demo products |
| ⚖️ Product Comparison | Side-by-side comparison with AI summary |
| ⭐ Review Intelligence | Sentiment analysis + fake review indicators |
| 💰 Price Tracking | Historical charts, price alerts, trend analysis |
| 📊 Shopping Pulse | Personalized dashboard with charts and insights |
| 🌿 Sustainability Insights | Eco scores with radar charts per product |
| 👤 User Profile | Preferences, wishlist, and price alerts |
| 🔒 AI Safety | Clear demo labels, no fabricated data claims |

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with React Router v6
- **Recharts** for charts (LineChart, PieChart, BarChart, RadarChart)
- CSS3 with CSS custom properties (no external UI library)

### Backend
- **Node.js + Express.js**
- **MySQL2** (promise-based)
- **Multer** for image uploads
- **Helmet + Rate Limiting** for security
- **JWT** for authentication

### AI & Data
- **IBM watsonx.ai** + **IBM Granite 13B Chat**
- **LangChain** for agent orchestration
- **LangFlow** for visual workflow design
- **RAG** with Chroma vector store (optional)
- **Demo mode** with pre-built responses when APIs not configured

### Database
- **MySQL 8+**

---

## 📁 Project Structure

```
smartshop-ai/
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── components/          # Navbar, Footer, ProductCard, Notification
│       ├── context/ShopContext  # Global state (wishlist, comparison, alerts)
│       ├── data/demoData.js     # 22 sample products + reviews + price history
│       ├── pages/               # 10 pages + ProductDetail
│       ├── services/api.js      # Backend API abstraction
│       ├── App.jsx              # Router and layout
│       └── index.css            # Global styles
│
├── backend/
│   ├── routes/          # Express routes (products, ai, search, reviews, etc.)
│   ├── controllers/     # Business logic
│   ├── services/
│   │   ├── aiService.js   # IBM Granite integration + demo fallback
│   │   └── ragService.js  # RAG retrieval and context building
│   ├── agents/
│   │   └── orchestrator.js  # Shopping assistant orchestrator agent
│   ├── database/db.js   # MySQL connection pool
│   ├── .env.example     # Environment variable template
│   └── server.js        # Express app entry point
│
├── ai/
│   ├── langflow/workflow.yaml  # LangFlow agent workflow definition
│   ├── prompts/system_prompts.py  # IBM Granite prompt templates
│   └── rag/rag_pipeline.py     # RAG indexing pipeline (LangChain + Chroma)
│
├── database/
│   ├── schema.sql   # Full MySQL schema
│   └── seed.sql     # Sample products, reviews, price history
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MySQL** 8.0+
- (Optional) Python 3.9+ for RAG pipeline
- (Optional) IBM Cloud account for watsonx.ai

---

## 🚀 Installation

### 1. Clone / Download the project

```bash
cd smartshop-ai
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. (Optional) Install Python AI dependencies

```bash
pip install langchain chromadb sentence-transformers
```

---

## 🗄️ Database Setup

### 1. Start MySQL

```bash
# macOS (Homebrew)
brew services start mysql

# Windows — start MySQL service from Services panel or:
net start mysql80

# Ubuntu/Debian
sudo service mysql start
```

### 2. Create database and tables

```bash
mysql -u root -p < database/schema.sql
```

### 3. Load sample data

```bash
mysql -u root -p < database/seed.sql
```

### 4. Verify

```sql
mysql -u root -p smartshop_ai
SELECT name, price FROM products LIMIT 5;
```

---

## 🔧 Environment Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
# Required for database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartshop_ai

# JWT (change in production)
JWT_SECRET=your-secret-key-change-this

# Demo mode (set false when IBM keys are configured)
DEMO_MODE=true

# IBM watsonx.ai (optional — leave blank for demo mode)
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
GRANITE_MODEL_ID=ibm/granite-13b-chat-v2
```

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
# Backend: http://localhost:5000
```

### Start the Frontend

```bash
cd frontend
npm start
# Frontend: http://localhost:3000
```

> The frontend proxies `/api/*` requests to the backend automatically (configured in `package.json`).

### Access the app

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 IBM watsonx.ai Configuration

### Step 1: Create an IBM Cloud account

Visit [https://cloud.ibm.com](https://cloud.ibm.com) and create a free account.

### Step 2: Create a watsonx.ai project

1. Navigate to **watsonx.ai** in the IBM Cloud catalog
2. Create a new project
3. Note your **Project ID**

### Step 3: Create an API key

1. Go to **Manage → Access (IAM) → API Keys**
2. Create a new API key
3. Copy the key immediately (shown once only)

### Step 4: Configure environment variables

```env
WATSONX_API_KEY=your_actual_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
GRANITE_MODEL_ID=ibm/granite-13b-chat-v2
DEMO_MODE=false
```

### Step 5: Restart the backend

```bash
npm run dev
```

The AI assistant will now use IBM Granite for real AI responses.

---

## 🔗 LangFlow / LangChain Setup

### Option A: LangFlow (Visual)

```bash
pip install langflow
langflow run
# Open: http://localhost:7860
# Import: ai/langflow/workflow.yaml
```

### Option B: LangChain (Code)

```bash
pip install langchain chromadb sentence-transformers

# Build RAG index
python ai/rag/rag_pipeline.py

# Set in .env
LANGFLOW_API_URL=http://localhost:7860
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Product details |
| GET | `/api/products/:id/price-history` | Price history |
| GET | `/api/products/categories` | All categories |
| GET | `/api/products/recommendations` | AI recommendations |
| POST | `/api/products/compare` | Compare products |
| POST | `/api/ai/chat` | AI assistant chat |
| POST | `/api/ai/compare-summary` | AI comparison summary |
| POST | `/api/ai/price-insight` | Price trend analysis |
| POST | `/api/search/text` | Text search |
| POST | `/api/search/image` | Image search |
| POST | `/api/search/voice` | Voice search |
| GET | `/api/reviews` | Product reviews |
| POST | `/api/reviews/analyze` | AI review analysis |
| GET | `/api/dashboard` | Dashboard data |
| GET | `/api/preferences` | User preferences |
| PUT | `/api/preferences` | Update preferences |
| GET | `/api/wishlist` | Wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:id` | Remove from wishlist |
| GET | `/api/price-alerts` | Price alerts |
| POST | `/api/price-alerts` | Create alert |
| DELETE | `/api/price-alerts/:id` | Delete alert |
| POST | `/api/auth/demo` | Demo login |

---

## 🎭 Demo Mode

When `DEMO_MODE=true` (default), the app runs fully without external APIs:

- ✅ All 22 products browsable with filters and sorting
- ✅ AI assistant responds with pre-built intelligent responses
- ✅ Product comparison with auto-generated summaries
- ✅ Review analysis with heuristic algorithms
- ✅ Price tracking with simulated historical data
- ✅ Dashboard with charts (PieChart, BarChart, RadarChart)
- ✅ Wishlist and price alerts (stored in React state)
- ✅ Voice search (browser Speech Recognition API)
- ✅ Image search (accepts upload, returns demo similar products)
- ⚠️ All data is clearly labeled as demo/simulated

---

## 📄 Pages Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page, hero, features, trending products |
| `/assistant` | AI Assistant | Chat interface with IBM Granite |
| `/search` | Multimodal Search | Text, image, and voice search |
| `/discover` | Product Discovery | Browse with filters and sorting |
| `/product/:id` | Product Detail | Full details, specs, reviews, price history |
| `/compare` | Comparison | Side-by-side comparison table + AI summary |
| `/reviews` | Review Intelligence | Sentiment analysis + fake review detection |
| `/price-tracking` | Price Tracking | Charts, alerts, trend analysis |
| `/dashboard` | Shopping Pulse | Personalized stats dashboard |
| `/sustainability` | Sustainability | Eco scores with radar charts |
| `/profile` | User Profile | Preferences, wishlist, alerts |

---

## 🏗️ Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────────┐
│         React Frontend              │
│  (Context API for global state)     │
└───────────────┬─────────────────────┘
                │ REST API
                ▼
┌─────────────────────────────────────┐
│       Express.js Backend            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Orchestrator Agent        │   │
│  │  (intent detection + routing│   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  RAG Service                │   │
│  │  (keyword retrieval + MySQL)│   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  AI Service                 │   │
│  │  IBM Granite / Demo Mode    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
                │
                ▼
        MySQL Database
    (products, reviews, prices,
     wishlist, alerts, preferences)
```

---

## 🔒 Security Notes

- API keys are loaded from environment variables only
- Passwords are hashed with bcryptjs (not stored in plain text)
- Rate limiting applied to all `/api/*` routes
- Helmet.js sets security headers
- SQL queries use parameterized statements (no SQL injection)
- File upload restricted to images only, max 5MB

---

## ⚠️ Disclaimers

- All product data is for **demonstration only**
- Prices shown do not reflect actual marketplace prices
- Sustainability scores are **estimated** — not verified certifications  
- AI responses may contain errors — always verify before purchase
- Fake review indicators are **potential signals only** — not definitive proof
- Price forecasts are **estimates** — future prices cannot be guaranteed

---

## 📧 Support

This project is built for college/academic demonstration purposes.  
For IBM watsonx.ai support: [https://cloud.ibm.com/docs/watson](https://cloud.ibm.com/docs/watson)  
For LangFlow: [https://docs.langflow.org](https://docs.langflow.org)

---

*Built with IBM Granite Models · React.js · Node.js · MySQL · LangChain*
