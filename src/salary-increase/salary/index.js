export class Salary {
  constructor(base) {
    this._base = base;
  }

  get base() {
    return this._base;
  }

  multiply(factor) {
    return new Salary(this.base * factor);
  }
}
