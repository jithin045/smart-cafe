# ☕ Smart Café Management System

A high-performance, aesthetically driven Full Stack management ecosystem designed for modern café operations. This system features a "Secure Terminal" aesthetic with specialized interfaces for different user roles, moving beyond standard junior-level implementations into mid-level system architecture.

## 🚀 Key Features

*   **Secure Authentication**: Implements robust Role-Based Access Control (RBAC) for Admin and Staff members.
*   **Aesthetic Command Center**: A "System Active" themed UI featuring glassmorphism, backdrop blurs, and neon green accents.
*   **Dual-Mode Kitchen Queue**: Real-time order management with toggleable **Card** and **List** views for staff efficiency.
*   **Admin Control Panel**: Comprehensive dashboard for revenue tracking, inventory monitoring, and staff oversight.
*   **Modern UI/UX**: Built with a focus on clean architecture, smooth Framer Motion transitions, and layout.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15+ (Turbopack), TypeScript, Tailwind CSS.
*   **Backend**: Node.js, Express, Strapi.
*   **Database**: MongoDB (MERN Stack) with potential for multi-tenant vector logic.
*   **Animations**: Framer Motion & Typewriter Effect.
*   **Icons**: Lucide React.

## 📦 Getting Started

### 1. Installation
```bash
git clone [https://github.com/jithin045/smart-cafe.git](https://github.com/jithin045/smart-cafe.git)
cd smart-cafe
npm install
2. Environment Setup
Create a .env file in the root directory:

NEXT_PUBLIC_API_URL=your_backend_api_url

3. Run Development Server
Bash
npm run dev
Open http://localhost:3000 to access the terminal.

📁 Project Logic
Staff Dashboard: Features a high-contrast "Kitchen Node" interface with live order status and automated quantity control logic.

Admin Dashboard: Focused on high-level management and system-wide monitoring.

Security: Client-side role verification and persistent session management via local storage tokens.