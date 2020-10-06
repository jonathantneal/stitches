import { tokenizeValue } from '../src/shorthand-parser/value-tokenizer';

describe('Tokenizing', () => {
  test('Undefined', () => {
    tokenizeValue(undefined as any);
  });

  test('Two Ident Tokens', () => {
    tokenizeValue('solid red');
  });
});
