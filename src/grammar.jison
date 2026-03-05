/* Lexer */
%lex
%%
\s+                       /* skip whitespace */
\/\/[^\n]*                /* skip // comments */

/* numbers: WITHOUT leading sign (avoid 1-2 becoming 1 + (-2) as a token) */
([0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?)    return 'NUMBER';

/* operators grouped by precedence */
"**"                      return 'opow';
"*"|"/"                   return 'opmu';
"+"|"-"                   return 'opad';

/* parentheses */
"("                       return '(';
")"                       return ')';

<<EOF>>                   return 'EOF';
.                         return 'INVALID';
/lex

/* Parser */
%start expressions
%token NUMBER
%token opad opmu opow
%left opad
%left opmu
%right opow
%%

expressions
  : e EOF                 { return $1; }
  ;

e
  : e opad t              { $$ = /* $1 (+|-) $3 */; }
  | t                     { $$ = $1; }
  ;

t
  : t opmu r              { $$ = /* $1 (*|/) $3 */; }
  | r                     { $$ = $1; }
  ;

/* power level: right associative */
r
  : f opow r              { $$ = /* $1 ** $3 */; }
  | f                     { $$ = $1; }
  ;

f
  : NUMBER                { $$ = /* number literal */; }
  | '(' e ')'             { $$ = $2; }
  ;

%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
