# Senior Frontend Engineer - Take Home Assessment

## Overview

This assessment is designed to evaluate your ability to work with legacy codebases, refactor technical debt, and establish modern frontend patterns. You'll be working with intentionally messy code that reflects real-world challenges we face daily.

## What We're Testing

1. **Code Organization & Architecture**: Can you structure code in a maintainable way?
2. **React Best Practices**: Do you understand when (and when NOT) to use hooks?
3. **Refactoring Skills**: Can you clean up technical debt without breaking functionality?
4. **React Query Expertise**: Can you set up proper query key management and data fetching patterns?
5. **Problem-Solving**: Can you identify and fix performance issues and anti-patterns?

## The Task

You'll be refactoring a **Ticket Management** feature that has accumulated technical debt over time. The code works, but it's messy, hard to maintain, and has several anti-patterns.

**Your job is to identify the issues and refactor the codebase to follow modern React and React Query patterns.**

### Components in the Codebase

The assessment includes several components in the `containers/` directory:
- `TicketsPage/` - Main ticket management page
- `TicketList/` - Ticket list component
- `UserProfile/` - User profile component
- `TicketFilters/` - Filter component
- Various hooks, utilities, and API files

**Note**: Some components may have errors (e.g., Redux not installed). This is intentional - part of your task is to identify and fix these issues.

### Your Mission

Refactor this codebase to follow modern React and React Query patterns. The code works, but it has accumulated technical debt that needs to be addressed.

**You are expected to identify specific issues and solutions independently.**

### Areas to Focus On

#### 1. React Hooks Usage
- Review all `useMemo`, `useCallback`, and `useEffect` usage
- Remove unnecessary optimizations
- Fix any circular dependencies or performance issues
- Consider when side effects should use React Query callbacks vs. `useEffect`

#### 2. React Query Setup
- Establish proper query key management
- Ensure query keys are type-safe and centralized
- Use React Query features appropriately (callbacks, invalidation, etc.)

#### 3. State Management
- Evaluate current state management approach
- Consider what belongs in component state vs. URL params vs. server state
- Remove unnecessary state management libraries

#### 4. File Organization
- Organize code in a maintainable, scalable structure
- Separate concerns appropriately (pages, components, hooks, API)
- Make code easy to navigate for new developers

## Getting Started

See **[QUICK_START.md](./QUICK_START.md)** for detailed setup instructions.

Quick start:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port)

**Note**: Some components may show errors initially. This is part of the assessment - you need to identify and fix these issues.

## Current State

The codebase has accumulated technical debt over time. You'll need to:

- Explore the codebase to identify issues
- Understand the current architecture and its problems
- Refactor to follow modern patterns
- Ensure the code is maintainable and scalable

The code comments may provide hints, but you're expected to identify specific issues and solutions independently.

## Expected Outcome

After your refactoring, the codebase should:

- ✅ Follow modern file organization patterns
- ✅ Use React hooks appropriately (only optimize where needed)
- ✅ Have proper React Query setup with centralized query key management
- ✅ Use appropriate state management (component state, URL params, server state)
- ✅ Be easy to navigate and understand for new developers
- ✅ Include clear documentation of your decisions

## Submission

1. Fork this repository
2. Complete the refactoring
3. Add a `REFACTORING_NOTES.md` file explaining:
   - Issues you identified
   - Solutions you implemented
   - Trade-offs you considered
   - What you would do differently if you had more time
4. Submit your repository link

## Tips

- Start by exploring the codebase and identifying issues
- Prioritize fixes based on impact and complexity
- Don't optimize prematurely - only add optimizations where they provide value
- Consider the developer experience - make it easy for others to understand and maintain

## Evaluation Criteria

You will be evaluated on:

1. **Problem Identification** - Did you find the issues without explicit guidance?
2. **Solution Quality** - Are your solutions appropriate and well-reasoned?
3. **Code Organization** - Is the structure maintainable and scalable?
4. **Best Practices** - Do you follow React and React Query best practices?
5. **Documentation** - Can you clearly explain your decisions and trade-offs?

## Reference Materials

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [React Query Key Manager](https://github.com/lukemorales/react-query-key-factory)
- [Elstar-lite Structure](https://github.com/ThemeNate/Elstar-lite/tree/main/src)

## Questions?

Feel free to reach out if you have any questions about the assessment. We're here to help!

Good luck! 🚀
