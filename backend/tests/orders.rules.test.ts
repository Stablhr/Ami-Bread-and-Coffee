import {priceLines} from '../api/utils/pricing';
import {checkPickupTime} from '../api/utils/pickupTime';

const SCONES = 'cat-scones';
const deal = {quantity: 3, price: 220};

describe('priceLines', () => {
  it('adds up lines with no deals', () => {
    expect(
      priceLines([
        {id: 'latte', categoryId: 'coffee', unitPrice: 150, quantity: 2, deal: null},
        {id: 'plain', categoryId: 'bread', unitPrice: 200, quantity: 1, deal: null}
      ])
    ).toEqual({subtotal: 500, discount: 0, total: 500});
  });

  it('applies "any 3 for 220" across mixed scone flavors', () => {
    const result = priceLines([
      {id: 'choco', categoryId: SCONES, unitPrice: 80, quantity: 2, deal},
      {id: 'apple', categoryId: SCONES, unitPrice: 80, quantity: 1, deal}
    ]);
    expect(result).toEqual({subtotal: 240, discount: 20, total: 220});
  });

  it('charges leftovers at the normal price', () => {
    // 4 scones = one bundle (220) + one at 80
    const result = priceLines([{id: 'choco', categoryId: SCONES, unitPrice: 80, quantity: 4, deal}]);
    expect(result.total).toBe(300);
  });

  it('does not give a discount below the bundle size', () => {
    const result = priceLines([{id: 'choco', categoryId: SCONES, unitPrice: 80, quantity: 2, deal}]);
    expect(result.discount).toBe(0);
  });
});

describe('checkPickupTime', () => {
  // 2026-11-17 10:00 Manila = 02:00 UTC
  const now = new Date('2026-11-17T02:00:00.000Z');

  it('accepts a time later today within shop hours', () => {
    expect(checkPickupTime(new Date('2026-11-17T14:00:00+08:00'), now)).toBeNull();
  });

  it('rejects times less than 30 minutes away', () => {
    expect(checkPickupTime(new Date('2026-11-17T10:15:00+08:00'), now)).toMatch(/30 minutes/);
  });

  it('rejects times outside 7:30 AM – 8:30 PM Manila', () => {
    expect(checkPickupTime(new Date('2026-11-18T06:00:00+08:00'), now)).toMatch(/7:30 AM/);
    expect(checkPickupTime(new Date('2026-11-17T21:00:00+08:00'), now)).toMatch(/8:30 PM/);
  });

  it('rejects times more than 7 days ahead', () => {
    expect(checkPickupTime(new Date('2026-11-25T10:00:00+08:00'), now)).toMatch(/7 days/);
  });
});
