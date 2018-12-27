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
    ];
  };

  const argTypeChecker = function (tester, notTester) {
    it('fails when first argument is not BN', function () {
      const test_cases = [
        ['10', '10'],
        [10, '10'],
        ['-10', '-10'],
        [-10, '-10'],
        ['123456789123456789123456789', '123456789123456789123456789'],
        [123456789123456789123456789, '123456789123456789123456789'],
        ['-123456789123456789123456789', '-123456789123456789123456789'],
        [-123456789123456789123456789, '-123456789123456789123456789'],
      ];

      test_cases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(actualMatchInvalidError);
        (() => notTester(a, b)).should.throw(actualMatchInvalidError);
      });
    });

    it('fails when second argument is not BN or string', function () {
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
  };

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
    const tester = function (a) {
      a.should.be.negative;
      a.should.be.bignumber.negative;

      expect(a).to.be.negative;
      expect(a).to.be.bignumber.negative;
    };

    const notTester = function (a) {
      a.should.not.be.negative;
      a.should.not.be.bignumber.negative;

      expect(a).to.not.be.negative;
      expect(a).to.not.be.bignumber.negative;
    };

    it('asserts negativity', function () {
      const test_cases = [
        new BN('-1'),
        new BN('-1234856789123456789'),
      ];

      test_cases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unnegativity', function () {
      const test_cases = [
        new BN('0'),
        new BN('1'),
        new BN('1234856789123456789'),
      ];

      test_cases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN', function () {
      const test_cases = [
        '-5',
        -5,
        '0',
        0,
        '5',
        5,
      ];

      test_cases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });

  describe('zero', function () {
    const tester = function (a) {
      a.should.be.zero;
      a.should.be.bignumber.zero;

      expect(a).to.be.zero;
      expect(a).to.be.bignumber.zero;
    };

    const notTester = function (a) {
      a.should.not.be.zero;
      a.should.not.be.bignumber.zero;

      expect(a).to.not.be.zero;
      expect(a).to.not.be.bignumber.zero;
    };

    it('asserts zeroness', function () {
      const test_cases = [
        new BN('0'),
      ];

      test_cases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unzeroness', function () {
      const test_cases = [
        new BN('1'),
        new BN('-1'),
        new BN('123456789123456789'),
        new BN('-123456789123456789'),
      ];

      test_cases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN', function () {
      const test_cases = [
        '-5',
        -5,
        '0',
        0,
        '5',
        5,
      ];

      test_cases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });
});
