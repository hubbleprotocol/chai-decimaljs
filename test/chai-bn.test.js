const BN = require('bn.js');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('../chai-bn')(BN));
chai.config.includeStack = true;

describe('chai-bn', function () {
  const actualMatchInvalidError = /to be an instance of BN/;
  const expectedMatchInvalidError = /to be an instance of BN or string/;

  const testerGenerator = function (function_names) {
    return [
      function (a, b) {
        function_names.forEach(function_name => {
          a.should.be.bignumber[function_name](b);
          expect(a).to.be.bignumber[function_name](b);
        });
      },

      function (a, b) {
        function_names.forEach(function_name => {
          a.should.not.be.bignumber[function_name](b);
          expect(a).to.not.be.bignumber[function_name](b);
        });
      }
    ]
  }

  const argTypeChecker = function (tester, notTester) {
    it('fails when first argument is not BN', function () {
      const test_cases = [
        ['10', '10'],
        ['-10', '-10'],
        ['123456789123456789123456789', '123456789123456789123456789'],
        ['-123456789123456789123456789', '-123456789123456789123456789'],
      ];

      test_cases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(actualMatchInvalidError);
        (() => notTester(a, b)).should.throw(actualMatchInvalidError);
      });
    });

    it('fails when first argument is not BN or string', function () {
      const test_cases = [
        [new BN('10'), 10],
        [new BN('-10'), -10],
        [new BN('123456789123456789123456789'), 123456789123456789123456789],
        [new BN('-123456789123456789123456789'), -123456789123456789123456789],
      ];

      test_cases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(expectedMatchInvalidError);
        (() => notTester(a, b)).should.throw(expectedMatchInvalidError);
      });
    });
  }

  describe('equal/equals/eq', function () {
    const [tester, notTester] = testerGenerator(['equal', 'equals', 'eq']);

    it('asserts equality', function () {
      const test_cases = [
        [new BN('10'), '10'],
        [new BN('10'), new BN('10')],

        [new BN('-10'), '-10'],
        [new BN('-10'), new BN('-10')],

        [new BN('123456789123456789123456789'), '123456789123456789123456789'],
        [new BN('123456789123456789123456789'), new BN('123456789123456789123456789')],

        [new BN('-123456789123456789123456789'), '-123456789123456789123456789'],
        [new BN('-123456789123456789123456789'), new BN('-123456789123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts inequality', function () {
      const test_cases = [
        [new BN('10'), '9'],
        [new BN('10'), new BN('9')],

        [new BN('-10'), '-9'],
        [new BN('-10'), new BN('-9')],

        [new BN('123456789123456789123456789'), '123456789123456789123456788'],
        [new BN('123456789123456789123456789'), new BN('123456789123456789123456788')],

        [new BN('-123456789123456789123456789'), '-123456789123456789123456788'],
        [new BN('-123456789123456789123456789'), new BN('-123456789123456789123456788')],
      ];

      test_cases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('above/gt/greaterThan', function () {
    const [tester, notTester] = testerGenerator(['above', 'gt', 'greaterThan']);

    it('asserts aboveness', function () {
      const test_cases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unaboveness', function () {
      const test_cases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      test_cases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('least/gte', function () {
    const [tester, notTester] = testerGenerator(['gte']);

    it('asserts at least', function () {
      const test_cases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],

        [new BN('123456789123456789'), '123456789123456789'],
        [new BN('123456789123456789'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123456789'],
        [new BN('-123456789123456789'), new BN('-123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.bignumber.at.least(b);
        expect(a).to.be.bignumber.at.least(b);
      });
    });

    it('asserts not at least', function () {
      const test_cases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      test_cases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.bignumber.at.least(b);
        expect(a).to.not.be.bignumber.at.least(b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('below/lt/lessThan', function () {
    const [tester, notTester] = testerGenerator(['below', 'lt', 'lessThan']);

    it('asserts belowness', function () {
      const test_cases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],
      ];

      test_cases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unbelowness', function () {
      const test_cases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('most/lte', function () {
    const [tester, notTester] = testerGenerator(['lte']);

    it('asserts at most', function () {
      const test_cases = [
        [new BN('10'), '15'],
        [new BN('10'), new BN('15')],

        [new BN('-10'), '15'],
        [new BN('-10'), new BN('15')],

        [new BN('-15'), '-10'],
        [new BN('-15'), new BN('-10')],

        [new BN('15'), '15'],
        [new BN('15'), new BN('15')],

        [new BN('-15'), '-15'],
        [new BN('-15'), new BN('-15')],

        [new BN('123456789123'), '123456789123456789'],
        [new BN('123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123'), '123456789123456789'],
        [new BN('-123456789123'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123'],
        [new BN('-123456789123456789'), new BN('-123456789123')],

        [new BN('123456789123456789'), '123456789123456789'],
        [new BN('123456789123456789'), new BN('123456789123456789')],

        [new BN('-123456789123456789'), '-123456789123456789'],
        [new BN('-123456789123456789'), new BN('-123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.bignumber.at.most(b);
        expect(a).to.be.bignumber.at.most(b);
      });
    });

    it('asserts not at most', function () {
      const test_cases = [
        [new BN('15'), '10'],
        [new BN('15'), new BN('10')],

        [new BN('15'), '-10'],
        [new BN('15'), new BN('-10')],

        [new BN('-10'), '-15'],
        [new BN('-10'), new BN('-15')],

        [new BN('123456789123456789'), '123456789123'],
        [new BN('123456789123456789'), new BN('123456789123')],

        [new BN('123456789123456789'), '-123456789123'],
        [new BN('123456789123456789'), new BN('-123456789123')],

        [new BN('-123456789123'), '-123456789123456789'],
        [new BN('-123456789123'), new BN('-123456789123456789')],
      ];

      test_cases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.bignumber.at.most(b);
        expect(a).to.not.be.bignumber.at.most(b);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('negative', function () {
    it('should be negative', function () {
      const test_cases = [
        -100,
        -100.50,
        -Infinity,
        '-1000000000000000001',
        new BN('-1000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.be.negative;
      }
    });

    it('should not be negative', function () {
      const test_cases = [
        NaN,
        0,
        100,
        100.50,
        Infinity,
        +Infinity,
        '1000000000000000001',
        new BN('1000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.not.be.negative;
      }
    });

    it('should fail if argument is not string, number or BN', function () {
      const test_cases = [
        {},
        [],
        function () {}
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        (function () {
          a.should.be.negative;
        }).should.throw(matchInvalidError);
      }
    });
  });

  describe('zero', function () {
    it('should be zero', function () {
      const test_cases = [
        0,
        -0,
        '+0',
        new BN('0')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.be.zero;
      }
    });

    it('should not be zero', function () {
      const test_cases = [
        NaN,
        -100.50,
        -100,
        100,
        100.50,
        Infinity,
        +Infinity,
        -Infinity,
        '1000000000000000001',
        new BN('1000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.not.be.zero;
      }
    });

    it('should fail if argument is not string, number or BN', function () {
      const test_cases = [
        {},
        [],
        function () {}
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        (function () {
          a.should.be.zero;
        }).should.throw(matchInvalidError);
      }
    });
  });
});
