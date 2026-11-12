-- PLAN T-014: guard the daily cap counters at the database level.
-- `sold` may exceed `cap` when an owner lowers a cap after sales, so only the
-- non-negative invariants are enforced here.

ALTER TABLE "DailyItemCap"
  ADD CONSTRAINT "DailyItemCap_cap_nonnegative" CHECK ("cap" >= 0),
  ADD CONSTRAINT "DailyItemCap_sold_nonnegative" CHECK ("sold" >= 0);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_quantity_positive" CHECK ("quantity" > 0);

ALTER TABLE "MenuItem"
  ADD CONSTRAINT "MenuItem_price_nonnegative" CHECK ("price" >= 0);
