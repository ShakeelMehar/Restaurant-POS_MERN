## 2024-10-25 - Redux Memoization
**Learning:** Found unmemoized Redux selectors that return arrays in the codebase. This causes new references to be returned on every render when used via `useSelector` causing expensive React re-renders.
**Action:** Use `createSelector` from `@reduxjs/toolkit` to memoize selector values which prevents returning new references if dependencies haven't changed.
