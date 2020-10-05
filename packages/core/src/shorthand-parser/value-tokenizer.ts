const TOKEN_COMMENT = 0;
const TOKEN_SPACE = 1;
const TOKEN_STRING = 2;
const TOKEN_HASH = 3;
const TOKEN_AT = 4;
const TOKEN_NUMERIC = 5;
const TOKEN_IDENT = 6;
const TOKEN_DELIM = 7;
const TOKEN_FUNCTION = 8;
const TOKEN_VAR = 9;

type TokenType =
  | typeof TOKEN_COMMENT
  | typeof TOKEN_SPACE
  | typeof TOKEN_STRING
  | typeof TOKEN_HASH
  | typeof TOKEN_AT
  | typeof TOKEN_NUMERIC
  | typeof TOKEN_AT
  | typeof TOKEN_IDENT
  | typeof TOKEN_DELIM
  | typeof TOKEN_FUNCTION
  | typeof TOKEN_VAR;

type Token = [TokenType, string, string, string, number, number];

const matchIdentifierSource = /(?:(?:[A-Za-z]|[^\x00-\x7F]|_|\d|-)|\\(?:[0-9A-Fa-f]{1,5}[ \t\n\f\r]?|[^\n\f\r]))+/
  .source;
const matchTokenOfComment = /(\/\*)((?:[^*]+|\*[^/])+)((?:\*\/)?)/g;
const matchTokenOfSpace = /()([ \n\f\r]+)()/g;
const matchTokenOfString = /(["'])((?:\\\r\n|\\[^]|(?!\1)[^\\\n\f\r])*)(\1?)/g;
const matchTokenOfHashOrVar = RegExp('([#$])(' + matchIdentifierSource + ')()', 'g');
const matchTokenOfAtIdent = RegExp('(@)(' + matchIdentifierSource + ')()', 'g');
const matchTokenofNumeric = RegExp(
  '()([+-]?\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?)((?:' + matchIdentifierSource + '|%)?)',
  'g'
);
const matchTokenOfIdentOrFunction = RegExp('()(' + matchIdentifierSource + ')(\\(?)', 'g');
const matchTokenOfDelim = /()([^])()/g;

const matchTokensOfAny = /(\/\*)|([ \n\f\r])|(["'])|([#$](?:[A-Za-z]|[^\x00-\x7F]|_|\d|-))|(@(?:-(?:(?:[A-Za-z]|[^\x00-\x7F]|_)|-|(?:\\[^\n\f\r]))|(?:[A-Za-z]|[^\x00-\x7F]|_)|(?:\\[^\n\f\r])))|([+-](?:\d|\.\d)|\.\d|\d)|((?:-(?:(?:[A-Za-z]|[^\x00-\x7F]|_)|-|(?:\\[^\n\f\r]))|(?:[A-Za-z]|[^\x00-\x7F]|_)|(?:\\[^\n\f\r])))|([^])/g;
const matchTokenOfType = [
  matchTokenOfComment,
  matchTokenOfSpace,
  matchTokenOfString,
  matchTokenOfHashOrVar,
  matchTokenOfAtIdent,
  matchTokenofNumeric,
  matchTokenOfIdentOrFunction,
  matchTokenOfDelim,
] as RegExp[];

const tokenizeValue = (str: string) => {
  let anyResult = null;
  let currentPosition = 0;

  const tokens: Token[] = [];

  while ((anyResult = matchTokensOfAny.exec(str))) {
    const initialTokenType = anyResult.indexOf(anyResult[0], 1) - 1;
    const matchToken = matchTokenOfType[initialTokenType];
    matchToken.lastIndex = currentPosition;
    const [{ length }, opening, content, closing = ''] = matchToken.exec(str) as RegExpExecArray;
    const openingPosition = currentPosition;
    const closingPosition = currentPosition + length;
    const tokenType = (initialTokenType === 3 && opening === '$'
      ? 9
      : initialTokenType === 6 && closing === '('
      ? 9
      : initialTokenType) as TokenType;
    tokens.push([tokenType, opening, content, closing, openingPosition, closingPosition]);
    matchTokensOfAny.lastIndex = currentPosition = closingPosition;
  }

  return tokens;
};
