## 2024-05-18 - Memoizing Selectors
**Learning:** Using normal functions like `(state) => state.items.map(...)` as Redux selectors returns new references on every state change, which breaks React.memo() and triggers unnecessary re-renders in components (e.g. PopularDishes.jsx relying on `selectAllDishes`).
**Action:** Always use `createSelector` from `@reduxjs/toolkit` for derived data or array manipulations to ensure stable reference equality.
