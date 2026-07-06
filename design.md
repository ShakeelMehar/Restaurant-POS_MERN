# Restaurant POS System Design Document

This document outlines the design architecture, visual language, components, and screen layouts for the Restaurant POS system, structured for compatibility with stitch.google.com.

## 1. Design System

### 1.1 Colors
The application uses a dark-themed UI to reduce glare in restaurant environments and provide high contrast.
* **Background (Base):** `#1f1f1f` (Dark Gray) - Used for the main application background and primary container backgrounds.
* **Primary Accent:** `#f6b100` (Yellow/Gold) - Used for primary buttons (e.g., "Sign in", "Sign up"), active states, and loading spinners.
* **Text (Primary):** `#ffffff` (White) - Used for primary headings and main body text.
* **Text (Secondary):** `#ababab` (Light Gray) - Used for labels, placeholder text, and secondary information.
* **Active/Selected:** `#4338ca` (Indigo-700) - Used for selected states (e.g., role selection in Auth).

### 1.2 Typography
* **Font Family:** `Inter`, sans-serif
* **Weights:** Regular (400), Medium (500), Bold (700)
* **Sizes:** 
  * Headings: Large, bold text for page titles.
  * Body: Base text size for general content.
  * Small: Used for labels and secondary details.

### 1.3 Layout & Spacing
* **Framework:** Tailwind CSS
* **Container:** Flexbox and Grid based layouts.
* **Spacing Base:** Uses Tailwind's default spacing scale (e.g., `p-5`, `mt-3`, `gap-3`).
* **Border Radius:** `rounded-lg` (8px) is heavily used for input fields, buttons, and cards to provide a modern, soft feel.

---

## 2. Reusable Components

### 2.1 Shared UI
* **Header:** Top navigation bar, visible on all authenticated routes.
* **BottomNav:** Bottom navigation bar for quick access to primary modules on mobile/tablet views.
* **BackButton:** A standard back navigation button.
* **FullScreenLoader:** A full-page overlay with a spinning yellow ring for loading states.
* **Modals:** 
  * `GlobalSearchModal`: An overlay for searching across the application.
  * `LogoutConfirmModal`: A prompt confirming user logout.
  * `Modal`: A generic wrapper for dialogs.
  * `NotificationDropdown`: A dropdown menu for displaying recent alerts.

### 2.2 Feature-Specific Components
* **Home Components:** `Greetings`, `MiniCard` (Stats), `PopularDishes`, `RecentOrders`, `OrderList`.
* **Orders Components:** `OrderCard` (Individual order summary), `OrderDetailsModal` (Expanded view).

---

## 3. Screens & Workflows

### 3.1 Authentication (`/auth`)
* **Purpose:** Employee login and registration.
* **Layout:** Centered form on a dark background.
* **Key Elements:**
  * Toggle between "Employee Login" and "Employee Registration".
  * Input fields for Email, Password, Name, Phone.
  * Role selection buttons (Waiter, Cashier, Admin) with active state highlighting.
  * Primary Yellow action button ("Sign in" / "Sign up").

### 3.2 Home / POS (`/`)
* **Purpose:** The main point-of-sale interface for active order management.
* **Layout:** Dashboard style with a sidebar/bottom nav and a main content area.
* **Key Elements:**
  * Header with user profile and notifications.
  * Greetings section.
  * Key metrics (MiniCards).
  * Quick access to Popular Dishes.
  * Recent Orders list and active OrderList panel.

### 3.3 Orders (`/orders`)
* **Purpose:** View and manage past and ongoing orders.
* **Layout:** List or Grid view of order cards.
* **Key Elements:**
  * Filtering and sorting options.
  * `OrderCard` components displaying order summary, status, and total.
  * Click to open `OrderDetailsModal`.

### 3.4 Tables (`/tables`)
* **Purpose:** Manage restaurant seating and table status.
* **Layout:** Grid view representing the floor plan.
* **Key Elements:**
  * Table blocks indicating status (Available, Occupied, Reserved).

### 3.5 Menu (`/menu`)
* **Purpose:** Display and manage the food menu categories and items.
* **Layout:** Categorized list or grid of menu items.
* **Key Elements:**
  * Category navigation tabs.
  * Menu item cards with images, names, and prices.

### 3.6 Dashboard (`/dashboard`)
* **Purpose:** Analytics and reporting for management.
* **Layout:** Analytical view with charts and comprehensive stats.
* **Key Elements:**
  * Sales reports, popular items, and revenue charts.

### 3.7 Catalog (`/catalog`)
* **Purpose:** Inventory and item database management.
* **Layout:** Table or list view of all products.
* **Key Elements:**
  * Add/Edit/Delete functionality for items in the database.
