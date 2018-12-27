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

  describe.only('equal/equals/eq', function () {
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

  describe.only('above/gt/greaterThan', function () {
    const [tester, notTester] = testerGenerator(['above', 'gt', 'greaterThan']);

    it('asserts greatness', function () {
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

    it('asserts ungreatness', function () {
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
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('least/gte', function () {
    it('should be greater than or equal to', function () {
      const test_cases = [
        [15, 10],
        ['15', 10],
        [15, '10'],
        ['15', '10'],
        [10.5, 10.5],
        ['10.5', 10.5],
        [10.6, '10.5'],
        ['10.6', '10.5'],
        ['1.000000000000000002', '1.000000000000000001'],
        [new BN('1.000000000000000002'), '1.000000000000000001'],
        ['1.000000000000000001', new BN('1.000000000000000001')],
        [new BN('1.000000000000000002'), new BN('1.000000000000000001')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.least(b);
      }
    });

    it('should be greater than or equal to when rounded', function () {
      const test_cases = [
        [10, 10],
        ['100.25356140', 100.25355912],
        [10, new BN('10.000000000000000001')],
        [15, 10],
        ['15.4279', 15.4274],
        [new BN('1.999999999999999999'), 1.999449]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.least(b, 3);
      }
    });

    it('should be greater than or equal to when rounded with specific rounding mode', function () {
      const test_cases = [
        ['100.5', 100.499],
        [1.995, new BN('1.999999999999999999')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.least(b, 2, BN.ROUND_HALF_UP);
      }
    });

    it('should not be greater than or equal to', function () {
      const test_cases = [
        [10, 15],
        ['10', 15],
        [10, '15'],
        ['10', '15'],
        [10.5, 10.6],
        ['10.5', 10.6],
        [10.5, '10.6'],
        ['10.5', '10.6'],
        ['1.000000000000000001', '1.000000000000000002'],
        [new BN('1.000000000000000001'), '1.000000000000000002'],
        ['1.000000000000000001', new BN('1.000000000000000002')],
        [new BN('1.000000000000000001'), new BN('1.000000000000000002')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.not.be.bignumber.at.least(b);
      }
    });

    it('should fail if arguments are not string, number or BN', function () {
      const test_cases = [
        [{}, 1],
        [1, {}],
        [function () {}, []]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        (function () {
          a.should.not.be.bignumber.at.least(b);
        }).should.throw(matchInvalidError);
      }
    });
  });

  describe('below/lt/lessThan', function () {
    it('should be less than', function () {
      const test_cases = [
        [10, 15],
        ['10', 15],
        [10, '15'],
        ['10', '15'],
        [10.5, 10.6],
        ['10.5', 10.6],
        [10.5, '10.6'],
        ['10.5', '10.6'],
        ['1.000000000000000001', '1.000000000000000002'],
        [new BN('1.000000000000000001'), '1.000000000000000002'],
        ['1.000000000000000001', new BN('1.000000000000000002')],
        [new BN('1.000000000000000001'), new BN('1.000000000000000002')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.lessThan(b);
      }
    });

    it('should be less than when rounded', function () {
      const test_cases = [
        [10, 15],
        [15.4271, '15.4276'],
        [1.999449, new BN('1.999999999999999999')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.lessThan(b, 3);
      }
    });

    it('should be less than when rounded with specific rounding mode', function () {
      const test_cases = [
        [10.045, 10.046],
        [1.555, new BN('1.559999999999999999')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.lessThan(b, 2, BN.ROUND_HALF_DOWN);
      }
    });

    it('should not be less than', function () {
      const test_cases = [
        [15, 10],
        ['15', 10],
        [15, '10'],
        ['15', '10'],
        [10.5, 10.5],
        ['10.5', 10.5],
        [10.6, '10.5'],
        ['10.6', '10.5'],
        ['1.000000000000000002', '1.000000000000000001'],
        [new BN('1.000000000000000002'), '1.000000000000000001'],
        ['1.000000000000000001', new BN('1.000000000000000001')],
        [new BN('1.000000000000000002'), new BN('1.000000000000000001')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.not.be.bignumber.lessThan(b);
      }
    });

    it('should fail if arguments are not string, number or BN', function () {
      const test_cases = [
        [{}, 1],
        [1, {}],
        [function () {}, []]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        (function () {
          a.should.not.be.bignumber.lessThan(b);
        }).should.throw(matchInvalidError);
      }
    });
  });

  describe('most/lte', function () {
    it('should be less than or equal to', function () {
      const test_cases = [
        [10, 10],
        ['10', 10],
        [10, '10'],
        ['10', '10'],
        [10.4, 10.5],
        ['10.4', 10.5],
        [10.4, '10.5'],
        ['10.4', '10.5'],
        ['1.000000000000000001', '1.000000000000000002'],
        [new BN('1.000000000000000001'), '1.000000000000000002'],
        ['1.000000000000000001', new BN('1.000000000000000002')],
        [new BN('1.000000000000000001'), new BN('1.000000000000000002')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.most(b);
      }
    });

    it('should be less than or equal to when rounded', function () {
      const test_cases = [
        [10, 10],
        ['100.25356140', 100.25355912],
        [10, new BN('10.000000000000000001')],
        [10, 15],
        [15.4274, '15.4279'],
        [1.999449, new BN('1.999999999999999999')],
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.most(b, 3);
      }
    });

    it('should be less than or equal to when rounded with specific rounding mode', function () {
      const test_cases = [
        ['102.005', 102],
        [10.005, new BN('10.000000000000000001')],
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.be.bignumber.at.most(b, 2, BN.ROUND_HALF_EVEN);
      }
    });

    it('should not be less than or equal to', function () {
      const test_cases = [
        [15, 10],
        ['15', 10],
        [15, '10'],
        ['15', '10'],
        [10.6, 10.5],
        ['10.6', 10.5],
        [10.6, '10.5'],
        ['10.6', '10.5'],
        ['1.000000000000000002', '1.000000000000000001'],
        [new BN('1.000000000000000002'), '1.000000000000000001'],
        ['1.000000000000000002', new BN('1.000000000000000001')],
        [new BN('1.000000000000000002'), new BN('1.000000000000000001')]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        a.should.not.be.bignumber.at.most(b);
      }
    });

    it('should fail if arguments are not string, number or BN', function () {
      const test_cases = [
        [{}, 1],
        [1, {}],
        [function () {}, []]
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i][0];
        var b = tests[i][1];
        (function () {
          a.should.not.be.bignumber.most(b);
        }).should.throw(matchInvalidError);
      }
    });
  });

  describe('finite', function () {
    it('should be finite', function () {
      const test_cases = [
        -100.5,
        -100,
        0,
        100,
        100.5,
        '1000000000000000001',
        new BN('1000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.be.finite;
      }
    });

    it('should not be finite', function () {
      const test_cases = [
        100.5 / 0,
        NaN,
        Infinity,
        -Infinity,
        +Infinity,
        new BN(100).dividedBy(0)
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.not.be.finite;
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
          a.should.be.finite;
        }).should.throw(matchInvalidError);
      }
    });
  });

  describe('integer', function () {
    it('should be integer', function () {
      const test_cases = [
        0,
        100,
        '1000000000000000001',
        new BN('1000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.be.an.integer;
      }
    });

    it('should not be integer', function () {
      const test_cases = [
        NaN,
        100.5,
        Infinity,
        -Infinity,
        +Infinity,
        '1.000000000000000001',
        new BN('1.000000000000000001')
      ];

      for (var i = 0; i < tests.length; i++) {
        var a = tests[i];
        a.should.not.be.an.integer;
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
          a.should.be.integer;
        }).should.throw(matchInvalidError);
      }
    });
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
