# YouCode

This repo is split into a `frontend` app and a `backend` app so UI code and server-side work can evolve separately.

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
cd frontend
npm install
npm run dev
```

This starts the Next.js dev server on `http://localhost:3000`.

## Backend

The backend lives in `backend/`. It is scaffolded for future API routes, services, and data-processing work.

### Run locally

```bash
cd backend
npm install
npm run dev
```

Current folders:

- `backend/src/routes` for HTTP endpoints
- `backend/src/services` for domain logic
- `backend/src/data` for backend-owned datasets or loaders

## Notes

- Unused default Next.js `public/*.svg` assets were removed.
- Old generated `.next` build output was removed from the repo structure.
- Frontend resource data was moved out of `app/` into `frontend/lib/data/` to keep route files cleaner.
