export function tenPercentRaise(aPerson) {
  raise(aPerson, 0.1);
}

export function fivePercentRaise(aPerson) {
  raise(aPerson, 0.05);
}

export function raise(aPerson, factor) {
  aPerson.salary = aPerson.salary.multiply(1 + factor);
}
