module.exports = function (BN) {
  BN = BN || require('bn.js');
  var isEqualTo = BN.prototype.eq;
  var isGreaterThan = BN.prototype.gt;
  var isGreaterThanOrEqualTo = BN.prototype.gte;
  var isLessThan = BN.prototype.lt;
  var isLessThanOrEqualTo = BN.prototype.lte;

  return function (chai, utils) {
    chai.Assertion.addProperty('bignumber', function () {
      utils.flag(this, 'bignumber', true);
    });

    var isBN = function (object) {
      return object.isBN ||
        object instanceof BN ||
        (object.constructor && object.constructor.name === 'BN');
    };

    var convert = function (value) {
      var number;

      if (typeof value === 'string') {
        number = new BN(value);
      } else if (isBN(value)) {
        number = value;
      } else {
        new chai.Assertion(value).assert(false,
          'expected #{act} to be an instance of BN or string');
      }

      return number;
    };

    var overwriteMethods = function (names, fn) {
      function overwriteMethod(original) {
        return function (value) {
          if (utils.flag(this, 'bignumber')) {

            var actual = this._obj;
            if (!isBN(actual)) {
              new chai.Assertion(actual).assert(false,
                  'expected #{actual} to be an instance of BN');
            }

            var expected = convert(value);
            fn.apply(this, [expected, actual]);
          } else {
            original.apply(this, arguments);
          }
        };
      }
      for (var i = 0; i < names.length; i++) {
        chai.Assertion.overwriteMethod(names[i], overwriteMethod);
      }
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

    // BN.isNegative
    chai.Assertion.addProperty('negative', function () {
      var value = convert(this._obj);
      this.assert(
        value.isNegative(),
        'expected #{this} to be negative',
        'expected #{this} to not be negative',
        value.toString()
      );
    });

    // BN.isZero
    chai.Assertion.addProperty('zero', function () {
      var value = convert(this._obj);
      this.assert(
        value.isZero(),
        'expected #{this} to be zero',
        'expected #{this} to not be zero',
        value.toString()
      );
    });
  };
};
