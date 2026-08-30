## 2026-08-30 - [Optimize Order Counting Logic]
**Learning:** Found a case in React UI components where statistics metrics (counts based on different criteria) are recalculated inefficiently on every render using multiple `filter` operations.
**Action:** Always check array `filter` and aggregation logic in UI loops for performance improvements, reducing O(N*K) iterations (K being the number of categories) to a single O(N) iteration, combined with `useMemo`.
