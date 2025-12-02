# Admin Panel

The admin panel is now fully implemented and accessible at `/admin-panel`.

## Routes

- `/admin-panel` - Dashboard (default)
- `/admin-panel/users` - Users Management
- `/admin-panel/properties` - Properties Management
- `/admin-panel/analytics` - Revenue Analytics
- `/admin-panel/system-monitoring` - System Monitoring

## Features

### Dashboard
- **Stats Overview**: Total Users, Active Properties, Monthly Revenue, Platform Health
- **User Growth Chart**: Area chart showing user growth over 6 months
- **Quick Stats**: Real-time stats for new users, pending verifications, and active leases
- **Recent Activity**: Live feed of platform activities

### Users Management
- **User Table**: Complete list of all platform users
- **Search & Filter**: Search users by name/email with filter options
- **User Details**: Name, email, role (Owner/Tenant), status, join date
- **Actions**: Edit and delete user capabilities
- **Add User**: Button to add new users to the platform

### Properties Management
- **Property Cards**: Visual cards for each property
- **Property Details**: Name, location, bedrooms, bathrooms, rent price
- **Status Indicators**: Active/Inactive status badges
- **View Details**: Quick access to detailed property information

### Revenue Analytics
- **Revenue Stats**: Total revenue, monthly growth, active subscriptions, avg transaction
- **Revenue vs Expenses Chart**: Line chart comparing revenue and expenses
- **Revenue by Category**: Pie chart showing revenue breakdown (Rent Payments, Service Fees, Premium Plans)
- **Transaction Volume**: Bar chart showing monthly transaction counts
- **Time Period Selection**: Filter data by time period

### System Monitoring
- **System Health Stats**: Server uptime, database status, API response time, active users
- **CPU Usage Chart**: Real-time CPU usage monitoring
- **Memory Usage Chart**: Memory consumption tracking
- **API Requests Chart**: Hourly API request volume
- **System Logs**: Live system event logs with status indicators

## Charts & Visualizations

All charts are built using **Recharts** library:
- **Line Charts**: Revenue trends, API requests
- **Area Charts**: User growth, CPU/Memory usage
- **Bar Charts**: Transaction volume
- **Pie Charts**: Revenue distribution by category

## Design

- **Dark Sidebar**: Professional dark theme (#0a1929) with teal accent
- **Clean Layout**: Modern, spacious design with proper spacing
- **Responsive**: Fully responsive grid layouts
- **Color-Coded Stats**: Each metric has its own color scheme
- **Interactive Charts**: Hover tooltips and legends
- **Status Indicators**: Visual badges for different states

## Navigation

The sidebar includes:
- Dashboard
- Users Management
- Properties
- Revenue Analytics
- System Monitoring
- Settings (bottom)
- Logout (bottom)

## Admin Info

The sidebar displays:
- Admin avatar with initials
- Admin name: "Admin User"
- Admin email: "admin@rentalhub.com"

All components are production-ready with proper error handling and responsive design. The charts use real data structures that can be easily connected to your backend API.
