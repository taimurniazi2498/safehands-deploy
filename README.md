# SafeHands Quote Form

Tasks 3, 4 and 5 of the SafeHands Insurance Quote SPA: an accessible quote request form with live validation, connected to a mock quotes API with loading and error states, plus dark mode, performance tweaks and automated tests. Built with React and Vite.

[![CI](https://github.com/taimurniazi2498/safehands-dark-mode-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/taimurniazi2498/safehands-dark-mode-tests/actions/workflows/ci.yml)

## Features

- Fields: full name, email, phone and insurance type (Health, Auto, Home, Life)
- HTML5 input types (`text`, `email`, `tel`) with `required` attributes
- Live validation: errors update while typing and when a field loses focus
- On submit, the first invalid field receives focus
- Valid data is sent to a mock endpoint (jsonplaceholder) with `fetch`
- A spinner is shown while the request is pending, and the submit button is disabled
- On failure, a friendly error message appears with a "Try again" button
- On success, a quote card shows the estimated premium, coverage amount, deductible and quote ID
- Responsive layout, checked on a mobile viewport (iPhone SE)
- Light and dark theme with a sun/moon toggle in the header, remembered between visits

## Dark mode

- Light and dark colour palettes are defined as CSS variables in `src/index.css` (`:root` and `[data-theme='dark']`)
- `ThemeProvider` keeps the theme in React state, sets `data-theme` on the `<html>` element and saves the choice in `localStorage`
- On the first visit the theme follows the system setting (`prefers-color-scheme`); after that the saved choice is used
- The toggle button in the NavBar has an `aria-label` that changes with the theme
- Component styles use the theme variables, so no hard-coded colours are left outside `index.css`

## Performance

Lighthouse was run on the production build (`npm run build`, then `npm run preview`) in an Incognito window:

| Category | Score |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |

![Lighthouse scores](docs/lighthouse-scores.png)

- Route-based code splitting with `React.lazy` and `Suspense`: the About and Quote pages are loaded only when a visitor opens them, so the first page load stays small
- The build now produces separate chunks for the About and Quote pages

## Testing

Unit tests use **Vitest** with React Testing Library. Vitest has the same API as Jest (`describe`, `it`, `expect`) and works directly with the Vite config, so no extra Babel setup is needed.

- 34 unit tests cover the NavBar, App routing, QuoteForm validation, QuoteResult, Spinner, ErrorBanner, the `useQuoteRequest` hook and the quotes API (with `fetch` mocked)
- Coverage: 97.8% statements, 87.3% branches, 100% functions, 98.2% lines

End-to-end tests use **Cypress** (`cypress/e2e/quote-flow.cy.js`) with the quotes API intercepted, so they do not depend on the network:

- An empty submit shows validation errors and focuses the first field
- A valid form shows the quote card
- A failed request shows the error banner, and "Try again" recovers
- The dark theme is still active after a page reload

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests: install, lint, unit tests with coverage, production build and the Cypress tests.

## Accessibility

- Every input has a `<label>` linked with `htmlFor`
- Invalid fields use `aria-invalid` and `aria-describedby` pointing to their error message
- Error messages use `role="alert"` so screen readers announce them
- The quote result area uses `aria-live="polite"` so loading, error and success updates are announced
- The whole form can be used with the keyboard only (Tab, Shift+Tab, Enter), with a clear focus outline
- The theme toggle and the menu button are real buttons with labels and visible focus outlines

## Tech

React, Vite, React Router, validator.js (email check), CSS Modules, Vitest, React Testing Library, Cypress, GitHub Actions

## Project structure

- `src/components/QuoteForm.jsx`: the form, validation and submit handling
- `src/components/QuoteResult.jsx`: shows the spinner, error message or quote card
- `src/components/NavBar.jsx`: navigation, mobile menu and theme toggle
- `src/context/`: `ThemeProvider`, `themeContext` and the `useTheme` hook
- `src/hooks/useQuoteRequest.js`: request state (idle, pending, success, error), retry and cancel
- `src/api/quotesApi.js`: the `fetch` call to the mock endpoint
- `cypress/e2e/`: end-to-end tests

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/quote

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run preview`: serve the production build
- `npm run lint`: run ESLint
- `npm test`: run the unit tests once
- `npm run coverage`: run the unit tests with a coverage report
- `npm run cypress:run`: run the Cypress tests (start `npm run dev` first)
- `npm run cypress:open`: open the Cypress runner

## How to test loading and error states

1. Fill in the form and submit. A spinner appears, then the quote card.
2. Open Chrome DevTools, go to the Network tab and set throttling to Offline.
3. Submit again. A friendly error message appears with a "Try again" button.
4. Set throttling back to No throttling and click "Try again". The quote card appears without refilling the form.

## How to test dark mode

1. Click the moon icon in the header. The page switches to the dark theme and the icon changes to a sun.
2. Reload the page. The dark theme stays.
3. In DevTools, open Application, then Local Storage, and check the `theme` key.

## What was done and why

Task 3: I used controlled inputs so the form state is always in React. Each field has its own validation function, so error messages stay specific and easy to change. ARIA attributes and focus management make the form usable for keyboard and screen reader users.

Task 4: The request state lives in a reducer inside the `useQuoteRequest` hook, with four states (idle, pending, success, error). A reducer keeps the UI state in React state, makes every change explicit, and stops impossible combinations such as a spinner and an error at the same time. The hook remembers the last submitted values so retry does not need the form to be filled again, and it cancels an older request when a new one starts.

Task 5: I used CSS variables for the two colour palettes, so switching theme only changes one attribute on the `<html>` element instead of rewriting component styles. The choice is saved in `localStorage` so it survives a reload. For performance I split the About and Quote pages with `React.lazy`, because most visitors only need the Home page first. I chose Vitest over Jest because the project already uses Vite, which means the same config and no extra setup. The Cypress tests intercept the API so they are fast and do not fail because of the network, and the CI workflow runs lint, unit tests, the build and Cypress on every push so a broken change is caught early.