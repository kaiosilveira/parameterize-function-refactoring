import { fivePercentRaise, tenPercentRaise } from '.';
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
