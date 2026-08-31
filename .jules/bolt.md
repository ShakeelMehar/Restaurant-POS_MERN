## 2024-05-18 - [Memoizing Redux Array Selectors]
**Learning:** Unmemoized Redux selectors that return arrays (e.g., using `flatMap` or `map`) cause unnecessary React re-renders on every Redux action dispatch, even if the relevant slice of state has not changed.
**Action:** Use `@reduxjs/toolkit` `createSelector` to memoize derived data and arrays to ensure stable references and avoid unnecessary re-renders.
