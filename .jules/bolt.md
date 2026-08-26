## 2024-05-19 - Redux Selectors and Component Re-renders
**Learning:** Using basic selector functions in Redux (like mapping over an array) returns a new reference on every state change, even if the underlying data hasn't changed. This causes React components using `useSelector` with these selectors to needlessly re-render.
**Action:** Always use `createSelector` from `@reduxjs/toolkit` for derived state in Redux to memoize the output and prevent unnecessary React re-renders.
