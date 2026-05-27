# ☕ Smart Café Management System

A full-stack café management system designed to handle real-world café operations including ordering, role-based dashboards, and administrative control.

---

# 🚀 Overview

The Smart Café Management System is a role-based web application that streamlines café operations by providing separate interfaces for customers, kitchen staff, and administrators.

It focuses on workflow efficiency, order tracking, and centralized management.

---

# 👥 User Roles

## 🧑 Customer
- Browse menu items
- Place orders
- Track order status in real time

## 🍳 Kitchen Staff
- View incoming orders
- Update order status (Preparing → Ready)
- Manage order queue efficiently

## 🧑‍💼 Admin
- Manage menu items
- Monitor orders
- View sales and system activity
- Oversee staff operations

---

# ⚙️ Key Features

- 🔐 Role-Based Access Control (Customer / Admin / Kitchen Staff)
- 🧾 Order lifecycle management system
- 🔄 Real-time order status updates
- 📊 Admin dashboard for monitoring operations
- 🍽️ Dual order management views (Card / List)
- 🎯 Responsive UI designed for fast workflow

---

# 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**UI Libraries:** Lucide React  

---

# 📦 Project Structure

- Customer Interface → Menu browsing & ordering
- Kitchen Dashboard → Order processing workflow
- Admin Dashboard → System management & analytics

---

# 🔐 Authentication

- Role-based authentication system
- Session-based or token-based login (depending on implementation)
- Protected routes for each role

---

# 🚀 Getting Started

```bash
git clone https://github.com/jithin045/smart-cafe.git
cd smart-cafe
npm install
npm run dev
