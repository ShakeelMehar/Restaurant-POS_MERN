
## 2024-05-20 - Memoizing derived arrays in Redux Selectors
**Learning:** Redux selectors that use `.flatMap()` or `.map()` to return new derived arrays cause unnecessary re-renders in React components if they are not memoized. By default, `useSelector` uses strict reference equality (`===`). A new array reference causes the component to re-render every time the Redux store updates, even if the relevant slice data hasn't changed. This is especially true for components like `PopularDishes.jsx` mapping over all items.
**Action:** Always use `createSelector` from `@reduxjs/toolkit` when creating selectors that compute derived arrays or objects from Redux state to ensure reference stability.
