import { Peekable } from "./lexer.mjs";

export function parse_expression(tokens) {
	if (!(tokens instanceof Peekable)) tokens = new Peekable(tokens);

	return parse_equality(tokens);
}

export class Binary {
	constructor(left, operator, right) {
		this.left = left;
		this.operator = operator;
		this.right = right;
	}
}
export class Unary {
	constructor(operator, value) {
		this.operator = operator;
		this.value = value;
	}
}

function parse_equality(tokens) {
	let ret = parse_comparison(tokens);
	while (['==', '!='].includes(tokens.peek())) {
		ret = new Binary(ret, tokens.nextValue(), parse_comparison(tokens));
	}
	return ret;
}
function parse_comparison(tokens) {
	let ret = parse_term(tokens);
	while (['>', '>=', '<', '<='].includes(tokens.peek())) {
		ret = new Binary(ret, tokens.nextValue(), parse_term(tokens));
	}
	return ret;
}
function parse_term(tokens) {
	let ret = parse_factor(tokens);
	while (['-', '+'].includes(tokens.peek())) {
		ret = new Binary(ret, tokens.nextValue(), parse_factor(tokens));
	}
	return ret;
}
function parse_factor(tokens) {
	let ret = parse_unary(tokens);
	while (['/', '*'].includes(tokens.peek())) {
		ret = new Binary(ret, tokens.nextValue(), parse_unary(tokens));
	}
	return ret;
}
function parse_unary(tokens) {
	if (['!', '-'].includes(tokens.peek())) {
		return new Unary(tokens.nextValue(), parse_unary(tokens));
	} else {
		return parse_primary(tokens);
	}
}
function parse_primary(tokens) {
	if (tokens.peek() instanceof Number || tokens.peek() instanceof String) {
		return tokens.nextValue();
	}
	if (tokens.peek() == 'true' || tokens.peek() == 'false') {
		return new Boolean(tokens.nextValue());
	}
	if (tokens.peek() == 'nil') {
		tokens.next();
		return null;
	}
	if (tokens.peek() == '(') {
		tokens.next();
		const ret = parse_expression(tokens);
		if (tokens.nextValue() != ')') throw new Error("Expected a closing parenthesis.");
		return ret;
	}
}
