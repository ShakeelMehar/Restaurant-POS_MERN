## 2024-05-24 - [Avoid returning new array/object references in Redux Selectors]
**Learning:** Redux selectors that use `.map()`, `.filter()`, or `.flatMap()` return a new array reference on *every* Redux state change, even if the underlying data hasn't changed. This causes all connected React components (e.g. via `useSelector`) to needlessly re-render because React sees the new array reference as a state update.
**Action:** Always wrap derived data calculations that return objects or arrays in Redux state with `createSelector` from `@reduxjs/toolkit` to memoize the results based on inputs.
