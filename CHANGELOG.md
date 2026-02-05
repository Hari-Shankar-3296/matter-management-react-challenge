# Changelog

All notable changes to the Matter Management project since the initial fork.

## [1.0.0] - 2026-02-06

### Added
- **Automation & CI/CD**
    - Integrated **Husky** and **lint-staged** for local Git hooks.
    - Added **Prettier** for consistent code formatting.
    - Created **GitHub Actions** CI workflow (lint, format, type-check, test).
    - Created **GitHub Actions** CD workflow for automated deployment to GitHub Pages.
    - Added `verify-deploy` npm script for one-command release.
- **Testing**
    - Achieved **90.14% unit test coverage** (152 tests passing).
    - Added snapshot testing for all major components and pages.
    - Implemented coverage reporting via Vitest/v8.
- **Features & UX**
    - Added **"Due this week" filter** to the Matters page.
    - Implemented **URL-based state management** for all filters (Deep linking support).
    - Added **granular loading states** to prevent UI flickering and preserve search focus.
    - Added **custom confirmation modals** for destructive actions (Delete/Update).
    - Added **inline assignee selection** on cards and detail views.
    - Added **input validations** for ticket creation and updates.
    - Updated branding with new logo, favicon, and project title.

### Changed
- **Architecture & Refactoring**
    - Modernized folder structure (Components, Pages, Hooks, Services, Utils).
    - Extracted inline rendering logic into 15+ reusable components.
    - Centralized UI elements like the unified `Badge` component.
    - Implemented **route-based code splitting** using `React.lazy` and `Suspense`.
    - Optimized bundle size with **manual chunking** (Vendor splitting).
    - Switched to `HashRouter` for seamless GitHub Pages compatibility.
- **Cleanup**
    - Removed unused Redux boilerplate and dead code files.
    - Flattened nested container structures for better readability.

### Fixed
- Fixed search focus loss during debounce by refactoring loading indicators.
- Fixed circular dependency issues in legacy components.
- Fixed layout inconsistencies across Dashboard and Tickets pages.
- Resolved all TypeScript and ESLint warnings.

---
*Generated based on git history from fork point.*
