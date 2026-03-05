/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Precedence and associativity', () => {
  test('multiplication binds tighter than subtraction: 4.0-2.0*3.0', () => {
    expect(calc('4.0-2.0*3.0')).toBeCloseTo(-2.0, 10);
  });

  test('division binds tighter than subtraction: 7-4/2', () => {
    expect(calc('7-4/2')).toBeCloseTo(5.0, 10);
  });

  test('addition and subtraction are left-associative: 10-3-2', () => {
    // (10-3)-2 = 5
    expect(calc('10-3-2')).toBeCloseTo(5.0, 10);
  });

  test('multiplication and division are left-associative: 20/5/2', () => {
    // (20/5)/2 = 2
    expect(calc('20/5/2')).toBeCloseTo(2.0, 10);
  });

  test('power is right-associative: 2**3**2', () => {
    // 2**(3**2)=2**9=512
    expect(calc('2**3**2')).toBeCloseTo(512.0, 10);
  });
});

describe('Float cases', () => {
  test('float precedence: 1.5+2.5*2.0', () => {
    // 1.5 + (2.5*2.0) = 6.5
    expect(calc('1.5+2.5*2.0')).toBeCloseTo(6.5, 10);
  });

  test('float division and subtraction: 10.0-5.0/2.0', () => {
    // 10 - 2.5 = 7.5
    expect(calc('10.0-5.0/2.0')).toBeCloseTo(7.5, 10);
  });

  test('float power: 4.0**0.5', () => {
    // sqrt(4)=2
    expect(calc('4.0**0.5')).toBeCloseTo(2.0, 10);
  });
});

describe('Parentheses', () => {
  test('parentheses override precedence: (1+2)*3', () => {
    expect(calc('(1+2)*3')).toBeCloseTo(9.0, 10);
  });

  test('nested parentheses: (2*(3+4))', () => {
    expect(calc('(2*(3+4))')).toBeCloseTo(14.0, 10);
  });

  test('parentheses with power: (2**3)**2', () => {
    // (8)**2 = 64
    expect(calc('(2**3)**2')).toBeCloseTo(64.0, 10);
  });

  test('parentheses force left grouping against right-assoc power: (2**3)**2 != 2**(3**2)', () => {
    expect(calc('(2**3)**2')).toBeCloseTo(64.0, 10);
    expect(calc('2**3**2')).toBeCloseTo(512.0, 10);
  });
});
