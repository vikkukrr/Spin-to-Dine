# 🍽️ Spin-to-Dine

A full-stack gamified food recommendation system that helps users decide what to eat using a fun spinning wheel. Reduces decision fatigue and boosts engagement with loyalty points, badges, streaks, and a competitive leaderboard.

---

## 📸 Screenshots

| Desktop Hero | Mobile Hero |
|---|---|
| ![Hero Desktop](screenshots/hero-desktop.png) | ![Hero Mobile](screenshots/hero-mobile.png) |

| Login | Register | Leaderboard |
|---|---|---|
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) | ![Leaderboard](screenshots/leaderboard.png) |

---

## 🚀 Features

- 🎡 **Interactive Spin Wheel** — Let fate pick your next meal
- ⭐ **Loyalty Points** — Earn points with every spin and order
- 🏅 **Badges & Achievements** — Unlock milestones as you engage
- 🔥 **Streaks** — Daily spin streaks with rewards
- 🏆 **Leaderboard** — Compete with other foodies (Points / Spins / Streaks)
- 🍛 **Restaurant & Menu Browsing** — Explore cuisines, filter by rating, veg, location
- 🔍 **Smart Search** — Search restaurants, cuisines, or dishes
- 🛒 **Cart & Checkout** — Full ordering flow with Stripe payment
- 👤 **User Authentication** — Register / Login with JWT
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** — Theme toggle support
- 🌐 **i18n** — English / Hindi language support

---

## 🛠️ Tech Stack

### Frontend
- React 18, React Router 6
- Tailwind CSS, Custom CSS
- Framer Motion (animations)
- Axios (HTTP client)
- i18next (internationalization)

### Backend
- Node.js, Express.js
- JWT Authentication
- bcryptjs (password hashing)
- RESTful API

### Database
- MongoDB + Mongoose

---

## 📁 Project Structure

```
Spin-to-Dine/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── Navbar.js
│       │   ├── SpinWheel.js
│       │   ├── RestaurantCard.js
│       │   ├── CartItem.js
│       │   ├── LoadingSkeleton.js
│       │   └── StripePayment.js
│       ├── context/                 # React Context providers
│       │   ├── AuthContext.js
│       │   ├── CartContext.js
│       │   ├── ThemeContext.js
│       │   └── ToastContext.js
│       ├── pages/                   # Route pages
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Leaderboard.js
│       │   ├── Cart.js
│       │   ├── Checkout.js
│       │   ├── Orders.js
│       │   ├── Profile.js
│       │   ├── Favorites.js
│       │   ├── SpinHistory.js
│       │   ├── AdminDashboard.js
│       │   └── RestaurantDetails.js
│       ├── services/
│       │   ├── api.js
│       │   └── spinService.js
│       ├── styles/
│       │   ├── home.css
│       │   ├── navbar.css
│       │   ├── global.css
│       │   └── spinwheel.css
│       ├── hooks/
│       │   └── usePushNotifications.js
│       ├── App.js
│       ├── index.js
│       └── i18n.js
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── orderController.js
│   │   ├── spinController.js
│   │   ├── leaderboardController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   ├── Badge.js
│   │   └── GamificationLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── spinRoutes.js
│   │   └── ...
│   ├── utils/
│   │   ├── recommendationEngine.js
│   │   └── email.js
│   ├── seed.js                      # Database seed script
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── screenshots/                    # Project screenshots
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/vikkukrr/Spin-to-Dine.git
cd Spin-to-Dine

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2️⃣ Environment Variables

Create `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/Gamification
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 3️⃣ Seed the Database

```bash
cd server
node seed.js
```

### 4️⃣ Run the App

```bash
# Terminal 1 — Backend
cd server
npm start

# Terminal 2 — Frontend
cd client
npm start
```

Frontend runs on `http://localhost:3000`, API on `http://localhost:5000`.

---

## 🧠 How It Works

1. **Browse** restaurants and dishes on the home page
2. **Filter** by cuisine, rating, veg/non-veg, location
3. **Spin the Wheel** when you can't decide — earn points and badges
4. **Order** your chosen meal through cart and checkout
5. **Compete** on the leaderboard with other foodies
6. **Track** your streaks, spins, and achievements on your profile

---

## 🔮 Future Improvements

- 🤖 AI-powered personalized recommendations
- 💰 Budget-based smart filtering
- 📍 Real-time location-based restaurant suggestions
- 📱 Native mobile app (React Native)
- 🎨 More gamification elements (levels, quests)

---

## 👨‍💻 Authors

- **Pawan Kumar** — [@pawan-25k](https://github.com/pawan-25k)
- **Vikram Kumar Paswan** — [@vikkukrr](https://github.com/vikkukrr)

---

## ⭐ Contribute

Fork the repo, create a feature branch, and submit a PR. All contributions welcome!
