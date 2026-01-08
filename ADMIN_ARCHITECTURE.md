# Government Admin Dashboard - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ODOP Marketplace Platform                  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                    React App (App.jsx)                │    │
│  │                                                       │    │
│  │  Routes by Path Prefix:                             │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │                                                       │    │
│  │  /admin/* ────────────┐                              │    │
│  │                       ├─→ Admin Dashboard            │    │
│  │  /seller/* ───────────┤   (Independent Portal)       │    │
│  │  /         ───────────┘                              │    │
│  │  (Seller Login)                                      │    │
│  │                                                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Admin Dashboard Route Flow

```
/admin/dashboard
     ↓
[Check adminAuthToken in localStorage]
     ├─ NOT FOUND → Show AdminLoginComponent
     │             ↓
     │         Email validation: @mpgov.in
     │         Password validation: MPAdmin2026
     │             ↓
     │         [Store in localStorage]
     │             ↓
     └─────────→ AdminDashboard
                 
[Authenticated] → AdminDashboard Component Tree
    ├── Header
    │   ├── Title & Subtitle
    │   └── User Info + Logout
    │
    ├── Main Content
    │   ├── AdminKPICards (3 cards)
    │   │   ├── Revenue Card
    │   │   ├── Sellers Card
    │   │   └── GI Tags Card
    │   │
    │   ├── AdminDistrictLeaderboard (Bar Chart)
    │   │   └── Recharts BarChart
    │   │
    │   ├── AdminTrendChart (Line Chart)
    │   │   └── Recharts LineChart
    │   │
    │   ├── AdminExportReadinessHeatmap (Treemap)
    │   │   ├── Recharts Treemap
    │   │   └── Color Legend
    │   │
    │   └── Quick Stats (4 summary items)
    │       ├── Avg Export Readiness
    │       ├── YoY Growth Rate
    │       ├── Processing Capacity
    │       └── International Markets
```

## Data Flow

### Authentication Flow

```
User Input (Email + Password)
    ↓
AdminLoginComponent
    ↓
useAdminAuth.login()
    ↓
adminAuthService.login()
    ├─ Validate email (@mpgov.in)
    ├─ Validate password (MPAdmin2026)
    └─ Store in localStorage:
        ├── adminAuthToken (Base64)
        ├── adminEmail
        └── adminLoginTime
    ↓
Update useAdminAuth state
    ↓
Redirect to AdminDashboard
```

### Dashboard Data Flow

```
AdminDashboard Component (Mounting)
    ├── AdminKPICards
    │   └── Static kpiData array
    │
    ├── AdminDistrictLeaderboard
    │   ├── Static districtData array
    │   └── Pass to Recharts BarChart
    │
    ├── AdminTrendChart
    │   ├── Static trendData array
    │   └── Pass to Recharts LineChart
    │
    └── AdminExportReadinessHeatmap
        ├── Static data array
        ├── Calculate colors (score → RGB)
        └── Pass to Recharts Treemap
```

## State Management

### useAdminAuth Hook
```javascript
{
  isAuthenticated: boolean,     // Auth status
  adminEmail: string,           // Current admin email
  loading: boolean,             // Loading state
  login: (email, password) ⟹ Promise,  // Login function
  logout: () ⟹ void           // Logout function
}
```

### localStorage Schema
```javascript
{
  adminAuthToken: "YWRtaW5AbXBnb3YuaW46TVBBZG1pbjIwMjY=",
  adminEmail: "admin@mpgov.in",
  adminLoginTime: "2026-01-06T10:30:00.000Z",
  
  // Note: seller data kept separate
  seller: { ... }  // Not affected by admin auth
}
```

## Authentication Separation

```
┌─────────────────────────────────────────┐
│         App.jsx Routing Logic            │
├─────────────────────────────────────────┤
│                                          │
│  if (path.startsWith('/admin'))         │
│      → Render Admin Portal               │
│        (Independent useAdminAuth)        │
│                                          │
│  else                                    │
│      → Render Seller Portal              │
│        (Independent useAuth)             │
│                                          │
└─────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐
│  Admin Side      │    │ Seller Side      │
├──────────────────┤    ├──────────────────┤
│ useAdminAuth     │    │ useAuth          │
│ adminAuthToken   │    │ seller (object)  │
│ adminEmail       │    │ sellerLoginTime  │
│ adminLoginTime   │    │ ...              │
└──────────────────┘    └──────────────────┘

Both use localStorage but different keys
→ NO CONFLICTS
→ INDEPENDENT OPERATION
```

## Component Dependencies

```
Frontend Package.json
├── react: ^18.2.0
├── react-dom: ^18.2.0
├── react-router-dom: ^6.20.0
├── axios: ^1.6.2
└── recharts: ^2.x (NEW - for charts)

Components Using recharts:
├── AdminDistrictLeaderboard.jsx
│   └── BarChart, Bar, XAxis, YAxis, ...
├── AdminTrendChart.jsx
│   └── LineChart, Line, XAxis, YAxis, ...
└── AdminExportReadinessHeatmap.jsx
    └── Treemap, Tooltip, ResponsiveContainer
```

## File Organization

```
frontend/src/
│
├── components/
│   ├── Admin* (NEW)
│   │   ├── AdminLoginComponent.jsx
│   │   ├── AdminLoginComponent.css
│   │   ├── AdminKPICards.jsx
│   │   ├── AdminKPICards.css
│   │   ├── AdminDistrictLeaderboard.jsx
│   │   ├── AdminDistrictLeaderboard.css
│   │   ├── AdminExportReadinessHeatmap.jsx
│   │   ├── AdminExportReadinessHeatmap.css
│   │   ├── AdminTrendChart.jsx
│   │   └── AdminTrendChart.css
│   │
│   └── [Seller components - unchanged]
│       ├── LoginComponent.jsx
│       ├── OnboardingComponent.jsx
│       └── UploadProductComponent.jsx
│
├── pages/
│   ├── AdminDashboard.jsx (NEW)
│   ├── AdminDashboard.css (NEW)
│   └── [Seller pages - unchanged]
│       ├── DashboardPage.jsx
│       └── DashboardPage.css
│
├── services/
│   ├── adminAuthService.js (NEW)
│   └── [Seller services - unchanged]
│       ├── api.js
│       └── authService.js
│
├── hooks/
│   ├── useAdminAuth.js (NEW)
│   └── [Seller hooks - unchanged]
│       └── useAuth.js
│
└── App.jsx (MODIFIED - added admin routing)
```

## Static Data Sources

All data is embedded as constants in components:

```javascript
// AdminKPICards.jsx
const kpiData = [
  { title: 'Total State Revenue', value: '₹1.2 Cr', ... },
  // ...
];

// AdminDistrictLeaderboard.jsx
const districtData = [
  { district: 'Indore', revenue: 50, sellers: 120 },
  // ...
];

// AdminTrendChart.jsx
const trendData = [
  { month: 'Jan', 'Bagh Print': 45000, ... },
  // ...
];

// AdminExportReadinessHeatmap.jsx
const data = [
  { name: 'Bagh Print', readinessScore: 85, ... },
  // ...
];
```

**No API calls needed for demo!**

## Styling Architecture

### Responsive Breakpoints
```css
/* Desktop (default) */
/* No media query needed */

/* Tablet */
@media (max-width: 1024px) {
  /* 2-column to 1-column layouts */
}

/* Mobile */
@media (max-width: 768px) {
  /* Reduced padding, smaller fonts */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Single column, minimal padding */
}
```

### Color System
```
Primary:     #667eea (Purple)
Secondary:   #764ba2 (Dark Purple)
Success:     #4caf50 (Green)
Warning:     #ffc107 (Yellow)
Danger:      #f44336 (Red)
Background:  #f5f7fa (Light Gray)
Text:        #333 (Dark)
Muted:       #999 (Gray)
Border:      #ddd (Light Gray)
```

## Security Notes (Demo)

⚠️ **This is a DEMO implementation**

Current approach:
- Credentials hardcoded in code
- Base64 encoding for token (NOT encrypted)
- localStorage for session (client-side)
- No HTTPS validation
- No rate limiting

For production:
- Use environment variables
- Implement JWT with signing
- Use secure HTTP-only cookies
- Add CSRF protection
- Implement rate limiting
- Add session timeout
- Use HTTPS only

## Performance Considerations

### Chart Rendering
- Recharts handles rendering optimization
- Data is small (static arrays < 1KB each)
- No re-renders on scroll

### DOM Optimization
- CSS Grid for responsive layouts
- Lazy component loading possible
- No unnecessary re-renders with React.memo

### Bundle Size Impact
```
recharts: ~150KB (minified)
Admin Components: ~25KB (minified)
Total Admin Portal: ~175KB
```

## Testing Checklist

```
✅ Authentication
   ✓ Valid credentials: admin@mpgov.in / MPAdmin2026
   ✓ Invalid email domain: rejected
   ✓ Invalid password: rejected
   ✓ Logout clears session
   ✓ Session persists on refresh

✅ Dashboard Components
   ✓ KPI cards display correctly
   ✓ Charts render with data
   ✓ Tooltips appear on hover
   ✓ Responsive on mobile

✅ Routing
   ✓ /admin/dashboard works
   ✓ /seller routes unaffected
   ✓ Navigation works correctly
   ✓ No routing conflicts

✅ Data Integrity
   ✓ All static data loads
   ✓ No console errors
   ✓ Charts display all series
```

---

**Created**: January 2026
**Status**: ✅ Production Ready for Demo
