import { calculateNewXPAndLevel } from '../xpUtils';

describe('calculateNewXPAndLevel', () => {
  it('calculates XP and level without leveling up', () => {
    const result = calculateNewXPAndLevel(10, 20);
    expect(result).toEqual({ newXp: 30, newLevel: 1 });
  });

  it('levels up when XP reaches 100', () => {
    const result = calculateNewXPAndLevel(90, 20);
    expect(result).toEqual({ newXp: 110, newLevel: 2 });
  });
});
