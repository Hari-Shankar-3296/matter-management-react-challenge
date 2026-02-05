# Quick Start Guide

## Prerequisites

- **Node.js** version 18.5.0 or higher
- **npm** (comes with Node.js)

## Step-by-Step Instructions

### 1. Navigate to the assessment directory

```bash
cd hiring/frontend-assessment
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Query
- React Router
- Vite (build tool)
- TypeScript
- And other dependencies

### 3. Start the development server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open in your browser

Open the URL shown in the terminal (usually `http://localhost:5173/`)

## Available Routes

Once running, you can visit:

- **`http://localhost:5173/`** - Main tickets page (TicketsPage component)
- **`http://localhost:5173/tickets`** - Same as above
- **`http://localhost:5173/ticket-list`** - Ticket list with circular dependencies
- **`http://localhost:5173/ticket-filters`** - Redux component (will show errors - intentional)
- **`http://localhost:5173/user-profile`** - User profile with unnecessary hooks

## Troubleshooting

### Port already in use?

If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the actual URL.

### Module not found errors?

Make sure you ran `npm install` first. If you still see errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?

The code intentionally has some issues that candidates need to fix. However, if you see build-blocking errors, check:
- Node.js version: `node --version` (should be 18.5.0+)
- TypeScript version matches package.json

### Redux errors in TicketFilters?

**This is intentional!** The `TicketFilters` component uses Redux, but Redux is not installed. This is part of the assessment - candidates need to remove Redux usage.

## Other Commands

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Run tests
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Lint code
```bash
npm run lint
```

### Format code
```bash
npm run format
```

### Verify and Deploy (Combined)
```bash
npm run verify-deploy
```
This single command will format, lint, test, build, and deploy your application in one go.

## What to Expect

When you run the app, you should see:

1. **Working components** - Most components will render, though they have code quality issues
2. **Console warnings** - You may see React warnings about missing dependencies (intentional)
3. **Redux errors** - The TicketFilters page will show errors (intentional - Redux not installed)
4. **React Query DevTools** - Bottom-right corner will show React Query DevTools (in dev mode)

## Next Steps

Once it's running:
1. Explore each route to see the different components
2. Open browser DevTools to see console warnings/errors
3. Review the code in `src/containers/` to see the issues
4. Read `README.md` for detailed refactoring guidance

## For Candidates

If you're a candidate taking this assessment:
1. Follow the instructions in `README.md`
2. Explore the codebase and identify issues independently
3. Refactor the code according to modern React and React Query patterns
4. Document your changes in `REFACTORING_NOTES.md`

Good luck! 🚀
