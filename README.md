# Mollywood Kitchen

> *Where Movies Meet Food — A Premium Cinematic Dining Experience*

Mollywood Kitchen is a modern, feature-rich web application for a premier restaurant, offering an interactive digital menu, special combo offers, table reservations, photo gallery, customer reviews, and an administrative dashboard for real-time menu and offer management.

---

## 🌟 Key Features

- **Interactive Digital Menu**: Filter by cuisine categories, search items, customize spice levels, and view real-time availability.
- **Promotions & Special Offers**: Dynamic promotional coupons, limited-time countdown timers, and discount package claim systems.
- **Table Reservations**: Seamless online booking system with date, time, party size selection, and status updates.
- **Photo Gallery**: High-resolution, vibrant visual showcase of dishes, kitchen artistry, and restaurant ambiance.
- **Shopping Cart & Checkout**: Integrated order summary, order status tracking, and flexible payment options.
- **User Authentication**: Secure customer sign-in and sign-up powered by Supabase Auth with social login support.
- **Admin Management Portal**: Comprehensive control panel to manage menu items, promotional offers, reservations, gallery items, and customer reviews.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling & Animations**: Tailwind CSS v4, Motion (Framer Motion)
- **Icons**: Lucide React
- **Backend & Database**: Supabase (Authentication & Data Store)
- **AI Integrations**: `@google/genai` (Server-side Gemini SDK)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mollywood-kitchen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the project root and add your configuration keys:

   ```env
   # Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Supabase Credentials (Optional for production sync)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server on port 3000 |
| `npm run build` | Builds the application for production deployment |
| `npm run preview` | Previews the local production build |
| `npm run lint` | Runs TypeScript type checking |
| `npm run clean` | Cleans build artifacts |

---

## 📁 Project Structure

```
.
├── public/              # Static assets
├── src/
│   ├── admin/           # Admin dashboard views & management panels
│   ├── components/      # Reusable UI components (Navbar, Footer, Offers, Gallery)
│   ├── context/         # Application state management (StoreContext)
│   ├── data/            # Initial dataset & fallback mock data
│   ├── lib/             # Third-party integrations (Supabase client, API utilities)
│   ├── types.ts         # TypeScript interfaces & type definitions
│   ├── App.tsx          # Main application component & layout routing
│   └── main.tsx         # Application entry point
├── package.json         # Dependencies & npm scripts
└── vite.config.ts       # Vite build configuration
```

---

## 📄 License

This project is proprietary and built for Mollywood Kitchen. All rights reserved.
