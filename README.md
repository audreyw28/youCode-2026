# YouCode

This repo is now split into a `frontend` app and a `backend` workspace so UI code and server-side work can evolve separately.

## Structure

```text
youcode/
  frontend/  # Next.js app and UI assets
  backend/   # future API/services layer
```

## Frontend

The frontend lives in `frontend/` and contains the current Next.js experience.

### Run locally

```bash
npm run dev
```

From the repo root this proxies to the frontend workspace and starts the Next.js dev server on `http://localhost:3000`.

## Backend

The backend lives in `backend/`. It is scaffolded for future API routes, services, and data-processing work.

Current folders:

- `backend/src/routes` for HTTP endpoints
- `backend/src/services` for domain logic
- `backend/src/data` for backend-owned datasets or loaders

## Notes

- Unused default Next.js `public/*.svg` assets were removed.
- Old generated `.next` build output was removed from the repo structure.
- Frontend resource data was moved out of `app/` into `frontend/lib/data/` to keep route files cleaner.
