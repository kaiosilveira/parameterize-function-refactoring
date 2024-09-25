import { baseCharge, withinBand } from '.';

describe('baseCharge', () => {
  it('should return 0 when usage is less than 0', () => {
    expect(baseCharge(-1)).toEqual('$0.00');
  });

  it('should return an amount based on the three bands of usage', () => {
    expect(baseCharge(0)).toEqual('$0.00');
    expect(baseCharge(50)).toEqual('$1.50');
    expect(baseCharge(100)).toEqual('$3.00');
    expect(baseCharge(150)).toEqual('$5.50');
    expect(baseCharge(200)).toEqual('$8.00');
    expect(baseCharge(250)).toEqual('$11.50');
  });
});

describe('withinBand', () => {
  const bottom = 100;
  const top = 200;

  it('should return the middle band of usage', () => {
    expect(withinBand(50, bottom, top)).toEqual(0);
    expect(withinBand(100, bottom, top)).toEqual(0);
    expect(withinBand(150, bottom, top)).toEqual(50);
    expect(withinBand(200, bottom, top)).toEqual(100);
    expect(withinBand(250, bottom, top)).toEqual(100);
  });
});
