import { lexer } from './lexer.mjs';

const tests = [
String.raw`class Breakfast {
	init(meat, bread) {
		this.meat = meat;
		this.bread = bread;
	}
	// ..
}`
];

for (const test of tests) {
	console.log([...lexer(test)]);
}
