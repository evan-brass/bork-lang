import { lexer, Peekable } from './lexer.mjs';
import { parse_expression } from './parser.mjs';

// console.log(...lexer(String.raw`class Breakfast {
// 	init(meat, bread) {
// 		this.meat = meat;
// 		this.bread = bread;
// 	}
// 	// ..
// }`));

const tokens = Array.from(lexer('(((4 + 9*2)))'));
console.log(tokens);

const expr = parse_expression(tokens);
console.log(expr);
