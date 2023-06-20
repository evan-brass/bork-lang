
export class Peekable {
	#inner;
	#peeked = [];
	constructor(inner) {
		this.#inner = inner[Symbol.iterator]();
	}
	next() {
		if (this.#peeked.length) {
			return this.#peeked.shift();
		} else {
			return this.#inner.next();
		}
	}
	nextValue() {
		return this.next()?.value;
	}
	peek(n = 1) {
		while (this.#peeked.length < n) {
			this.#peeked.push(this.#inner.next());
		}
		return this.#peeked[n - 1]?.value;
	}
	[Symbol.iterator]() {
		return this;
	}
}

export class Ident extends String {}

export class LexError extends Error {}

const reserved_words = [
	'and', 'class', 'else', 'false', 'fun', 'for', 'if', 'nil', 'or',
	'print', 'return', 'super', 'this', 'true', 'var', 'while'
];

const is_digit = /[0-9]/;
const is_ident = /[a-zA-Z0-9_]/;

export function* lexer(source_code) {
	const i = new Peekable(source_code);
	for (const c of i) {
		// Skip whitespace:
		if (!c.trim()) continue;

		// Single char tokens:
		else if ([
			'(', ')', '{', '}', ',', '.', '-', '+', ';', '*'
		].includes(c)) yield c;

		// Two char tokens:
		else if ([
			'!', '=', '>', '<'
		].includes(c)) {
			if (i.peek() == '=') {
				yield c + i.nextValue();
			} else {
				yield c;
			}
		}

		// Single-line comment:
		else if (c == '/' && i.peek() == '/') {
			while (i.peek() && i.nextValue() != '\n');
		}
		else if (c == '/') {
			yield c;
		}

		// TODO: Escape sequences

		// String Literals:
		else if (c == '"') {
			let ret = '';
			while (i.peek() && i.peek() != '"') ret += i.nextValue();
			if (i.nextValue() != '"') yield new LexError("Unclosed string literal");
			yield new String(ret);
		}

		// Digits:
		else if (is_digit.test(c)) {
			let ret = c;
			while (is_digit.test(i.peek())) ret += i.nextValue();

			if (i.peek() == '.' && is_digit.test(i.peek(2))) {
				ret += i.nextValue();
				while (is_digit.test(i.peek())) ret += i.nextValue();
			}

			yield new Number(ret);
		}

		// Identifier:
		else if (is_ident.test(c)) {
			let ret = c;
			while (is_ident.test(i.peek())) ret += i.nextValue();

			// Reserved words:
			if (reserved_words.includes(ret)) {
				yield ret;
			} else {
				yield new Ident(ret);
			}
		}
	}
}''
