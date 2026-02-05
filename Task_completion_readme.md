# Task Completion README

## Overview
This document explains all the features built for the Matter Management application, the approaches taken, and the reasoning behind each decision.

---

## 1. Theme System (Green + Dark/Light Mode)

### What was built
- **ThemeContext** (`src/contexts/ThemeContext.tsx`): Provides app-wide theme management
- **System preference detection**: Uses `prefers-color-scheme` media query
- **Theme toggle**: Single button in header that works across the entire app
- **localStorage persistence**: Remembers user's preference

### Approach
Used CSS custom properties (variables) for theming. The `data-theme` attribute on `<html>` switches between `dark` and `light` themes. This approach:
- Is performant (no React re-renders needed)
- Works with CSS transitions
- Is maintainable (all theme colors in one place)

### Color change: Blue → Green
Changed primary color from `#6366f1` (indigo) to `#10b981` (emerald green). Updated all gradients and accent colors.

---

## 2. Multi-User Authentication

### What was built
- **AuthContext** (`src/contexts/AuthContext.tsx`): Manages authentication state
- **LoginPage** (`src/pages/LoginPage.tsx`): User selection login (demo mode)
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`): Guards authenticated routes
- **Mock users API** (`src/services/users.ts`): 4 demo users

### Approach
For a demo app, used simple email-based login with mock users. In production, would integrate with OAuth/JWT. The AuthContext stores:
- Current user
- Loading state
- Login/logout functions
- List of all users (for assignee dropdowns)

---

## 3. Enhanced Tickets

### New Fields
| Field | Editable | Description |
|-------|----------|-------------|
| ID | No | Auto-generated |
| Priority | Yes | low, medium, high, critical |
| Reporter | No | Set to current user on creation |
| Assignee | Yes | Dropdown of all users |
| Due Date | Yes | Date picker |
| Created Date | No | Set on creation |

### Due This Week Badge
- Shows red "Due this week" badge inside cards
- Uses `isDueThisWeek()` utility function
- Also shows "Overdue" badge for past-due tickets

---

## 4. Dashboard with Charts

### What was built
- **DashboardPage** (`src/pages/DashboardPage.tsx`)
- **Stats cards**: Assigned to me, Reported by me, Total, Open
- **Pie chart**: Tickets by Status
- **Bar chart**: Tickets by Priority

### Library Choice: Recharts
Chose Recharts because:
- React-native integration
- Good TypeScript support
- Responsive containers built-in
- Lightweight compared to D3-based alternatives

---

## 5. Kanban Board

### Features
- **Board**: Shows Matters in columns (Backlog, To Do, In Progress, Testing, Done)
- **Due badges**: Inline red badges for due this week / overdue
- **Add/Edit/Delete**: Actions in table with confirmation modal

---

## 6. My Tickets Page

### Features
- **Tabs**: "Assigned to Me" and "Reported by Me"
- **Table view**: Shows ID, Title, Status, Priority, Reporter/Assignee, Due Date
- **Due badges**: Inline red badges for due this week / overdue
- **Add/Edit/Delete**: Actions in table with confirmation modal

---

## 7. Code Quality Fixes

### TASK 1: Removed Unnecessary useMemo/useCallback (UserProfile)
**Before**: 5 useMemo and 2 useCallback for simple string operations
**After**: Direct computed values

**Why**: Premature optimization. useMemo/useCallback have overhead. Only use when:
- Computation is expensive
- Value passed to memoized child
- Callback is a hook dependency

### TASK 2: Fixed Circular useEffect Dependencies (TicketList)
**Before**: 5 useEffects with circular dependencies causing infinite loops
**After**: 
- Derived state instead of useEffect+useState for notificationCount
- React Query's automatic refetch on query key change
- Removed success logging useEffect (use RQ callbacks if needed)

### TASK 5: Removed Redux (TicketFilters)
**Before**: Redux slice for simple filter state
**After**: React useState + URL params

**Why**: Redux was overkill for:
- Component-local state
- Simple filter values
- No need for time-travel debugging

### Centralized Query Keys
Created factory pattern in `utils/queryKeys.ts`:
```typescript
export const ticketKeys = {
    all: ['tickets'] as const,
    lists: () => [...ticketKeys.all, 'list'] as const,
    list: (filters) => [...ticketKeys.lists(), filters] as const,
    ...
};
```

---

## 8. File Organization

### CSS
All styles in `src/index.css` with CSS variables for theming. Components use class names that reference these styles.

### Folder Structure
```
src/
├── assets/         # Shared assets and css styles
├── components/     # Shared UI components
├── containers/     # Legacy container components (fixed)
├── contexts/       # React contexts (Theme, Auth)
├── hooks/          # Custom React Query hooks
├── pages/          # Route-level components
├── services/       # API functions
├── utils/          # Utility functions
├── constants.ts    # TypeScript constants
└── types.ts        # TypeScript types
and more
```

---

## 9. Production Readiness

### Implemented
- Error boundaries (via React Query)
- Loading states
- Proper TypeScript types
- Optimized React Query settings (staleTime, retry)
- Responsive design

### Approach I would consider for Production readiness
- Replace mock API with real backend
- Add proper authentication (OAuth/JWT)
- Add comprehensive error handling and validations
- Add pagination and virtualisation techniques to make UI performant
- Add proper caching and offline support
- Add unit/integration tests and automation tests with snapshots
- Implement proper logging
- Add analytics
- Add proper monitoring
- Add proper security measures
- Add proper accessibility measures
- Add proper performance measures
- Add proper scalability measures
- Add proper maintainability measures
- Better documentation

---

## Trade-offs Considered

1. **CSS-in-JS vs CSS files**: Chose CSS files for better performance and easier theming, will be simplifying for larger apps
2. **Redux vs Context**: Chose Context for auth/theme since state is simple
3. **Recharts vs Chart.js**: Chose Recharts for better React integration
4. **Component CSS files vs single CSS**: Single file for demo simplicity; would split for larger apps
