-- Add explicit "on the way" status for delivery orders (PLAN 6.5).
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY';
