# chai-decimaljs

[![NPM Package](https://img.shields.io/npm/v/chai-decimaljs.svg?style=flat-square)](https://www.npmjs.org/package/chai-decimaljs)

[`Chai`](https://www.chaijs.com/) assertions for comparing arbitrary-precision decimals using the [decimal.js](https://github.com/MikeMcl/decimal.js) library. Forked from [chai-bn](https://github.com/MikeMcl/decimal.js) (originally forked from [chai-bignumber](https://github.com/asmarques/chai-bignumber)), which uses the [bn.js](https://github.com/indutny/bn.js) library (originally the [bignumber.js](https://github.com/MikeMcl/bignumber.js) library).

## Installation

```bash
npm install --save-dev chai-decimaljs
```

## Usage

```javascript
const chai = require('chai');
const Decimal = require('decimal.js');

// Enable and inject Decimal dependency
chai.use(require('chai-decimaljs')(Decimal));
```

## Assertions

The following assertion methods are provided and will override the existing builtin assertions if the `bignumber` property is set as part of the assertion chain:
- equal/equals/eq
- above/gt/greaterThan
- least/gte
- below/lt/lessThan
- most/lte
- closeTo

A set of additional assertion properties is also provided:
- negative
- zero

Both actual values (the values being asserted) and expected values (the values the actual value is expected to match) can be either instances of `Decimal`, or strings which can be converted into a valid number. This is a key difference with [chai-bignumber](https://github.com/asmarques/chai-bignumber), which automatically converts JavaScript numbers to `BigNumber` instances for both actual and expected values.

Only BDD style (`expect` or `should`) assertions are supported.

## Examples

Methods:

```javascript
const actual = new Decimal('100').plus(new Decimal('0.0000000000000000000000000000001'));
const expected = '100.0000000000000000000000000000001';

actual.should.be.a.decimal.that.equals(expected);
expect(actual).to.be.a.decimal.that.is.at.most(expected);
(new Decimal('1999.999999999999999999')).should.be.a.decimal.that.is.lessThan('2000');
```

Properties:

```javascript
(new Decimal('-100.102')).should.be.a.decimal.that.is.negative;
expect(new Decimal('1.33').sub(new Decimal('1.33'))).to.be.a.decimal.that.is.zero;
```

Some `Chai` properties (e.g. the `that.is` chain) have no effect other than increasing readability, and can be dropped if less verbosity is desired.

## License

[MIT](LICENSE)
