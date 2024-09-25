import { fivePercentRaise, tenPercentRaise, raise } from '.';
import { Salary } from './salary';

describe('fivePercentRaise', () => {
  it("should raise a person's salary by 5%", () => {
    const person = { salary: new Salary(1000) };
    fivePercentRaise(person);
    expect(person.salary.base).toEqual(1050);
  });
});

describe('tenPercentRaise', () => {
  it("should raise a person's salary by 10%", () => {
    const person = { salary: new Salary(1000) };
    tenPercentRaise(person);
    expect(person.salary.base).toEqual(1100);
  });
});

describe('raise', () => {
  it('should raise a person salary by a given factor', () => {
    const person = { salary: new Salary(1000) };
    raise(person, 0.1);
    expect(person.salary.base).toEqual(1100);
  });
});
