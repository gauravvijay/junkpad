# Junkpad

A lightweight React/Vite application configured as a static site ready for deployment to GitHub Pages.

## Getting started

Install dependencies:

```sh
npm install
```

Run a local development server:

```sh
npm run dev
```

Open http://localhost:8080 to view the app.

## Building

Generate a production build:

```sh
npm run build
```

The output will be in `dist/`.

## Deploying to GitHub Pages

This project includes a `deploy` script that uses `gh-pages`.

```sh
npm run deploy
```

By default, the build is configured to work in a subdirectory (GitHub project pages). If you need to customize the base path, set the `VITE_BASE_URL` environment variable before building (for example, `VITE_BASE_URL=/my-repo/`).

## Notes

- The app stores its state in `localStorage` so your data persists between refreshes.
- No backend is required; the app runs entirely in the browser.
