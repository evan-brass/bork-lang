import { Binary, Unary } from "./parser.mjs";

class RuntimeError extends Error {}

export function evaluate(expr) {
	if (expr instanceof Binary) {
		let left = evaluate(expr.left);
		let right = evaluate(expr.right);

		if (expr.operator == '')
	}
	if (expr instanceof Unary) {
		let left = evaluate(expr.value);
		if (expr.operator == '-' && left instanceof Number) {
			return -left;
		}
		if (expr.operator == '!' && left instanceof Boolean) {
			return !left;
		}
		return new RuntimeError();
	}
	return expr;
}
