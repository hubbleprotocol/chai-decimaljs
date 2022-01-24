import Decimal from "decimal.js";

export default function (DecimalModule: any): any;
declare global {
    export namespace Chai {
        export interface DecimalComparer extends NumberComparer {
            (value: Decimal | string, message?: string): DecimalAssertion;
        }
        export interface DecimalCloseTo extends CloseTo {
            (value: Decimal | string, delta: Decimal | string, message?: string): DecimalAssertion;
        }
        export interface DecimalBoolean {
            (): DecimalAssertion;
        }
        export interface DecimalAssertion extends Assertion {
            equal: DecimalComparer;
            equals: DecimalComparer;
            eq: DecimalComparer;
            above: DecimalComparer;
            greaterThan: DecimalComparer;
            gt: DecimalComparer;
            gte: DecimalComparer;
            below: DecimalComparer;
            lessThan: DecimalComparer;
            lt: DecimalComparer;
            lte: DecimalComparer;
            least: DecimalComparer;
            most: DecimalComparer;
            closeTo: DecimalCloseTo;
            negative: DecimalBoolean;
            zero: DecimalBoolean;
        }
        export interface Assertion {
            decimal: DecimalAssertion;
        }
    }
}
