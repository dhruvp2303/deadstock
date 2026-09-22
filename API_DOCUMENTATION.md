# DeadStock API Documentation (v1)

Base URL: `http://127.0.0.1:8000/api/v1`

---

## 1. Authentication Endpoints

### Register
- **Method:** `POST`
- **Route:** `/api/v1/auth/register`
- **Body:**
```json
{
  "name": "Aditya Sharma",
  "email": "aditya@abcplastics.in",
  "password": "password123",
  "company_name": "ABC Plastics",
  "industry": "Industrial Plastics"
}
```
- **Response:** `201 Created` with Sanctum Bearer Token and User Profile.

### Login
- **Method:** `POST`
- **Route:** `/api/v1/auth/login`
- **Body:**
```json
{
  "email": "demo@deadstock.ai",
  "password": "password123"
}
```
- **Response:** `200 OK` with token.

### Current User Profile
- **Method:** `GET`
- **Route:** `/api/v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`

---

## 2. Inventory & Risk Analysis Endpoints

### List Inventory (with Filters & Sorting)
- **Method:** `GET`
- **Route:** `/api/v1/inventory?category=...&risk_level=...&search=...`
- **Response:** Returns list of SKUs with calculated `risk_score`, `risk_level`, `age`, `monthly_demand`, and `recommended_action`.

### Get Product Detail & Recovery Strategies
- **Method:** `GET`
- **Route:** `/api/v1/inventory/{identifier}` (ID or SKU e.g. `PC2048`)
- **Response:** Full inventory details, 8-month demand forecast, multi-channel recovery estimates (Sell, Transfer, Return, Recycle, Discount), and top buyer matches.

### Create & Auto-Analyze Inventory Item
- **Method:** `POST`
- **Route:** `/api/v1/inventory`
- **Body:**
```json
{
  "sku": "NEW-SKU-99",
  "product_name": "Precision Polymer Gear",
  "category": "Mechanical Components",
  "quantity": 3000,
  "unit_cost": 45.00,
  "monthly_demand": 250,
  "age_months": 8
}
```
- **Response:** `201 Created` with computed risk analysis score, loss, and buyer matches.

---

## 3. Buyer Matching Endpoints

### List High-Confidence Buyer Matches
- **Method:** `GET`
- **Route:** `/api/v1/matches`
- **Response:** Ranked buyer companies with compatibility breakdown (Product, Quantity, Industry, Location, Price).

### Matches for Specific SKU
- **Method:** `GET`
- **Route:** `/api/v1/matches/{identifier}`

---

## 4. Marketplace Endpoints

### List Marketplace Surplus
- **Method:** `GET`
- **Route:** `/api/v1/marketplace/listings?search=...&category=...`

### Create Marketplace Listing
- **Method:** `POST`
- **Route:** `/api/v1/marketplace/listings`
- **Body:**
```json
{
  "title": "Industrial Connector 20mm High Temp",
  "category": "Connectors & Components",
  "units_available": 5000,
  "price_per_unit": 28.00,
  "location": "Ahmedabad, Gujarat"
}
```

---

## 5. Analytics & Dashboard Endpoints

### Dashboard Summary
- **Method:** `GET`
- **Route:** `/api/v1/dashboard/summary`
- **Response:** Real-time metrics (Total Inventory ₹42.8Cr, At Risk ₹8.4Cr, Dead Stock ₹2.1Cr, Recovered ₹6.8Cr), health bar series, and risk distribution.

### Advanced Analytics Overview
- **Method:** `GET`
- **Route:** `/api/v1/analytics/overview`

### Sustainability Impact
- **Method:** `GET`
- **Route:** `/api/v1/sustainability/metrics`
- **Response:** Units reused (82,400), waste avoided (14.2 Tons), and circular flow stages.

---

## 6. AI Intelligence & Python ML Bridge

### Ask DeadStock AI
- **Method:** `POST`
- **Route:** `/api/v1/ai/ask`
- **Body:**
```json
{
  "query": "Which inventory should I focus on this month?"
}
```
- **Response:**
```json
{
  "success": true,
  "query": "Which inventory should I focus on this month?",
  "response": "12 products are at high risk of becoming dead stock, with Plastic Connector, PCB Module and Packaging Box needing immediate attention.",
  "intent": "risk_prioritization",
  "confidence": "95%",
  "data": {
    "priority_product": {
      "name": "Plastic Connector 20mm",
      "sku": "PC2048",
      "risk": "87%",
      "potential_loss": "₹3.2L",
      "recommended_action": "Find B2B buyer"
    }
  }
}
```

---

## 7. Contact / Demo Request

### Submit Demo Request
- **Method:** `POST`
- **Route:** `/api/v1/contact/demo-request`
- **Body:**
```json
{
  "name": "Aditya Sharma",
  "company": "ABC Plastics",
  "work_email": "aditya@abcplastics.in",
  "industry": "Industrial Plastics",
  "inventory_size": "₹5Cr+",
  "message": "Interested in B2B buyer matching and dead-stock liquidation."
}
```
