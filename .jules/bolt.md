## 2025-02-23 - Memoizing Redux Selectors
**Learning:** Redux selectors that return new references (e.g., using `flatMap` or `map` or `reduce` inside a selector) cause unnecessary re-renders in components relying on those selectors whenever any part of the Redux state updates, even unrelated parts.
**Action:** Always use `createSelector` from `@reduxjs/toolkit` when a selector derives data or returns new object/array references to memoize the result based on input dependencies.
