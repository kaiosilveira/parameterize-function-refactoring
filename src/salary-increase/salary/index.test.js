import { Salary } from '.';

describe('Salary', () => {
  describe('multiply', () => {
    it('should multiply the base by the factor and return a new Salary as a result', () => {
      const salary = new Salary(1000);
      const result = salary.multiply(1.1);
      expect(result.base).toEqual(1100);
    });
  });
});
