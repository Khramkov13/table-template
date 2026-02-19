# Frontend — table-template

Angular 21 application using standalone components and signals API.
This is the **frontend** half of a multi-repo full-stack app. The backend lives in a sibling repository: [table-database](https://github.com/Khramkov13/table-database).

## Structure

- `src/app/models/` — TypeScript interfaces (TableColumn, TableRow, TableResponse, SortState)
- `src/app/services/table.service.ts` — HTTP service calling backend API
- `src/app/components/` — Reusable UI components (DataTable, ItemForm)
- `src/app/pages/` — Route-level pages (TablePage)
- `src/environments/` — API URL config per environment

## Conventions

- Use Angular signals (`signal`, `computed`, `input`, `output`) instead of decorators
- Templates use `@if`, `@for`, `@empty` control flow syntax
- Backend URL is in `src/environments/environment.ts` — do not hardcode URLs in components

## Related Repository

The backend API this app consumes is at https://github.com/Khramkov13/table-database.
It runs on `http://localhost:3000` and exposes REST endpoints under `/api/items`.
