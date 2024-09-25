import { baseCharge, bottomBand, middleBand, topBand } from '.';

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

describe('usage bands', () => {
  describe('bottomBand', () => {
    it('should return the lesser of usage or 100', () => {
      expect(bottomBand(50)).toEqual(50);
      expect(bottomBand(100)).toEqual(100);
      expect(bottomBand(150)).toEqual(100);
    });
  });

  describe('middleBand', () => {
    it('should return the middle band of usage', () => {
      expect(middleBand(50)).toEqual(0);
      expect(middleBand(100)).toEqual(0);
      expect(middleBand(150)).toEqual(50);
      expect(middleBand(200)).toEqual(100);
      expect(middleBand(250)).toEqual(100);
    });
  });

  describe('topBand', () => {
    it('should return the top band of usage', () => {
      expect(topBand(50)).toEqual(0);
      expect(topBand(100)).toEqual(0);
      expect(topBand(150)).toEqual(0);
      expect(topBand(200)).toEqual(0);
      expect(topBand(250)).toEqual(50);
    });
  });
});
