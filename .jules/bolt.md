## 2026-09-09 - Memoize derived Redux state
**Learning:** Using `useSelector` with a selector that derives a new object or array on every invocation (like `.map` or `.flatMap`) causes unnecessary React re-renders when any unrelated state changes because it breaks reference equality.
**Action:** Use `createSelector` from `@reduxjs/toolkit` to memoize derived data (like arrays and objects) so the reference stays the same as long as the underlying dependencies do not change.
