export function tenPercentRaise(aPerson) {
  aPerson.salary = aPerson.salary.multiply(1.1);
}

export function fivePercentRaise(aPerson) {
  aPerson.salary = aPerson.salary.multiply(1.05);
}

export function raise(aPerson, factor) {
  aPerson.salary = aPerson.salary.multiply(1 + factor);
}
