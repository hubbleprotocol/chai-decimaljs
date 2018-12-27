module.exports = function (BN) {
  BN = BN || require('bn.js');
  const isEqualTo = BN.prototype.eq;
  const isGreaterThan = BN.prototype.gt;
  const isGreaterThanOrEqualTo = BN.prototype.gte;
  const isLessThan = BN.prototype.lt;
  const isLessThanOrEqualTo = BN.prototype.lte;
  const isNegative = BN.prototype.isNeg;
  const isZero = BN.prototype.isZero;

  return function (chai, utils) {
    chai.Assertion.addProperty('bignumber', function () {
      utils.flag(this, 'bignumber', true);
    });

    const isBN = function (object) {
      return object.isBN ||
        object instanceof BN ||
        (object.constructor && object.constructor.name === 'BN');
    };

    const convert = function (value) {
      if (typeof value === 'string') {
        return new BN(value);
      } else if (isBN(value)) {
        return value;
      } else {
        new chai.Assertion(value).assert(false,
          'expected #{act} to be an instance of BN or string');
      }
    };

    const assertBN = function (value) {
      if (!isBN(value)) {
        new chai.Assertion(value).assert(
          false,
          'expected #{value} to be an instance of BN'
        );
      }
    };

    const overwriteMethods = function (names, fn) {
      function overwriteMethod (original) {
        return function (value) {
          if (utils.flag(this, 'bignumber')) {

            const actual = this._obj;
            assertBN(actual);

            const expected = convert(value);
            fn.apply(this, [expected, actual]);
          } else {
            original.apply(this, arguments);
          }
        };
      }

      names.forEach(name =>
        chai.Assertion.overwriteMethod(name, overwriteMethod)
      );
    };

    // BN.eq
    overwriteMethods(['equal', 'equals', 'eq'], function (expected, actual) {
      this.assert(
        isEqualTo.bind(expected)(actual),
        'expected #{act} to equal #{exp}',
        'expected #{act} to be different from #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.gt
    overwriteMethods(['above', 'gt', 'greaterThan'], function (expected, actual) {
      this.assert(
        isGreaterThan.bind(actual)(expected),
        'expected #{act} to be greater than #{exp}',
        'expected #{act} to be less than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.gte
    overwriteMethods(['least', 'gte'], function (expected, actual) {
      this.assert(
        isGreaterThanOrEqualTo.bind(actual)(expected),
        'expected #{act} to be greater than or equal to #{exp}',
        'expected #{act} to be less than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.lt
    overwriteMethods(['below', 'lt', 'lessThan'], function (expected, actual) {
      this.assert(
        isLessThan.bind(actual)(expected),
        'expected #{act} to be less than #{exp}',
        'expected #{act} to be greater than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.lte
    overwriteMethods(['most', 'lte'], function (expected, actual) {
      this.assert(
        isLessThanOrEqualTo.bind(actual)(expected),
        'expected #{act} to be less than or equal to #{exp}',
        'expected #{act} to be greater than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });

    // BN.isNeg
    chai.Assertion.addProperty('negative', function () {
      const value = this._obj;
      assertBN(value);

      this.assert(
        isNegative.bind(value)(),
        'expected #{this} to be negative',
        'expected #{this} to not be negative',
        value.toString()
      );
    });

    // BN.isZero
    chai.Assertion.addProperty('zero', function () {
      const value = this._obj;
      assertBN(value);

      this.assert(
        isZero.bind(value)(),
        'expected #{this} to be zero',
        'expected #{this} to not be zero',
        value.toString()
      );
    });
  };
};
