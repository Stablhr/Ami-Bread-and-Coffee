-- Optional quantity deal (e.g. scones: 3 for 220).
ALTER TABLE "MenuItem" ADD COLUMN "dealQuantity" INTEGER;
ALTER TABLE "MenuItem" ADD COLUMN "dealPrice" INTEGER;
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_dealPrice_nonnegative" CHECK ("dealPrice" IS NULL OR "dealPrice" >= 0);
