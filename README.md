# Opinion Trading App

## Overview
The **Opinion Trading App** is a **Node.js** and **Express.js** application designed for real-time trading on sports events. It integrates **WebSockets** for live updates and uses **MongoDB** as its database.

## Features
✅ User authentication and authorization (JWT-based)
✅ Admin panel to manage sports events
✅ Real-time trade execution and status updates via WebSockets
✅ Fetching live sports data from external APIs
✅ Secure role-based access control

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Real-time Communication:** WebSockets
- **External API:** The Odds API

## Folder Structure
```
|-- src
|   |-- config
|   |   |-- db.js
|   |   |-- socket.js
|   |-- controllers
|   |   |-- adminController.js
|   |   |-- authController.js
|   |   |-- eventsController.js
|   |   |-- tradeController.js
|   |-- middlewares
|   |   |-- authAdmin.js
|   |   |-- authMiddleware.js
|   |   |-- authorizeRoles.js
|   |-- models
|   |   |-- Event.js
|   |   |-- Trade.js
|   |   |-- User.js
|   |-- routes
|   |   |-- adminRoutes.js
|   |   |-- authRoutes.js
|   |   |-- eventsRoutes.js
|   |   |-- tradeRoutes.js
|   |-- services
|   |   |-- apiServices.js
|   |-- utils
|   |   |-- tradeUtils.js
|-- server.js
|-- .env
|-- package.json
|-- README.md
```

## Installation
### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (running locally or via cloud service)

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/opinion-trading.git
   cd opinion-trading
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file and configure environment variables:**
   ```env
   MONGO_URI=mongodb://localhost:27017/opinion_trading
   JWT_SECRET=your_secret_key
   SPORTS_API_KEY=your_sports_api_key
   API_URL=https://api.the-odds-api.com/v4/sports/upcoming/odds
   PORT=5000
   ```
4. **Start the server:**
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- **`POST /api/auth/register`** - Register a new user
- **`POST /api/auth/login`** - Login user
- **`GET /api/auth/profile`** - Get user profile (requires authentication)

### Events
- **`POST /api/events`** - Create a new event (**Admin only**)
- **`GET /api/events`** - Fetch all events
- **`DELETE /api/events/:id`** - Delete event (**Admin only**)
- **`PUT /api/events/:id`** - Update event status (**Admin only**)

### Trades
- **`POST /api/trades`** - Create a trade (**Authenticated users**)
- **`GET /api/trades`** - Get all trades (**Admin only**)
- **`PUT /api/trades/:id`** - Update trade status (**Admin only**)

### Admin Actions
- **`GET /api/admin/fetchlivedata`** - Fetch live sports data
- **`PUT /api/admin/event/:id/status`** - Update event status

## WebSocket Events
- **`tradeUpdated`** - Notifies clients when a trade status changes
- **`eventCreated`** - Notifies clients when a new event is created
- **`eventUpdated`** - Notifies clients when an event status is updated

## Security & Authorization
🔐 **JWT-based authentication** for user security
🔐 **Role-based access control** (Admin/User)
🔐 **Environment variables** to protect sensitive data

## Contributing
🚀 Contributions are welcome! Follow these steps:
1. **Fork the repository.**
2. **Create a new feature branch.**
3. **Commit your changes.**
4. **Push to your branch and submit a Pull Request (PR).**

## License
📜 **MIT License** - Free to use and modify!

---
Made with ❤️ for real-time sports trading!

