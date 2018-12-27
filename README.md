# chai-bn

[![NPM Package](https://img.shields.io/npm/v/chai-bn.svg?style=flat-square)](https://www.npmjs.org/package/chai-bn)
[![Build Status](https://travis-ci.com/ZeppelinSolutions/chai-bn.svg?branch=master)](https://travis-ci.com/ZeppelinSolutions/chai-bn)

Chai assertions for comparing arbitrary-precision decimals using the [bn.js](https://github.com/indutny/bn.js) library. Forked from [chai-bignumber](https://github.com/asmarques/chai-bignumber), which uses the [bignumber.js](https://github.com/MikeMcl/bignumber.js) library.

## Installation

```bash
npm install --save-dev chai-bn
```

## Usage

```javascript
const chai = require('chai');
const BN = require('bn.js');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));
```

## Assertions

The following assertion methods are provided and will override the existing builtin assertions if the `bignumber` property is explicitly set as part of the assertion chain:
- equal/equals/eq
- above/gt/greaterThan
- least/gte
- below/lt/lessThan
- most/lte

A set of additional assertion properties is also provided:
- negative
- zero

Actual values (i.e. the values being asserted) must be instances of `BN`. Expected values (i.e. the values the actual value is expected to match) may be instances of either `BN` or `string` which can be converted into a valid number. Only BDD style (`expect` or `should`) assertions are supported.

## Examples

Methods:

```javascript
const actual = new BN('100000000000000000').plus(new BN('1');
const expected = '100000000000000001';

actual.should.be.bignumber.equal(expected);
expect(actual).to.be.bignumber.at.most(expected);
(new BN('1000')).should.be.bignumber.lessThan('2000');
```

Properties:

```javascript
(new BN('-100')).should.be.negative;
expect(new BN('1').sub(new BN('1'))).to.be.zero;
```

## License

[MIT](LICENSE)
