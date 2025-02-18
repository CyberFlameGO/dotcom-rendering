// ----- Imports ----- //

import type { Option, Result } from '@guardian/types';
import {
	err,
	ok,
	resultAndThen,
	ResultKind,
	resultMap,
	toOption,
} from '@guardian/types';

// ----- Types ----- //

interface Parser<A> {
	run: (a: unknown) => Result<string, A>;
}

// ----- Core Functions ----- //

const parser = <A>(f: (a: unknown) => Result<string, A>): Parser<A> => ({
	run: f,
});

/**
 * Ignores whatever the input is and instead provides a successful parsing
 * result containing `a`.
 *
 * @param a The value to be contained in the successful parsing result
 * @returns {Parser<A>} A `Parser` of `A`
 * @example
 * const fooParser = succeed('foo'); // Parser<string>
 *
 * const result = parse(fooParser)(42); // Ok<string>, with value 'foo'
 */
const succeed = <A>(a: A): Parser<A> => parser((_) => ok(a));

/**
 * Ignores whatever the input is and instead provides a failed parsing
 * result containing the error string `e`.
 *
 * @param e The error string to be provided as the parsing error
 * @returns {Parser<A>} A `Parser` of `A`
 * @example
 * const fooParser = fail('Uh oh!'); // Parser<A>
 *
 * const result = parse(fooParser)(42); // Err<string>, with value 'Uh oh!'
 */
const fail = <A>(e: string): Parser<A> => parser((_) => err(e));

const isObject = (a: unknown): a is Record<string, unknown> =>
	typeof a === 'object' && a !== null;

/**
 * Run a parser over a given input that's currently `unknown`, and attempt
 * to parse that input into a value of type `A`. If the parsing was successful
 * the result will be an `Ok<A>`. If it failed the result will be an
 * `Err<string>`.
 *
 * @param pa The parser to run over the input
 * @param a The `unknown` input to be parsed into type-safe value of type `A`
 * @returns {Result<string, A>} A parsing result, wrapped in a `Result` type.
 * @example
 * const json: unknown = JSON.parse('{ "foo": 42 }');
 *
 * const parserA = fieldParser('foo', numberParser); // Parser<number>
 * const resultA = parse(parserA)(json); // Ok<number>, with value 42
 *
 * const parserB = fieldParser('bar', numberParser); // Parser<number>
 * const resultB = parse(parserB)(json); // Err<string>, with 'missing field' err
 */
const parse =
	<A>(pa: Parser<A>) =>
	(a: unknown): Result<string, A> =>
		pa.run(a);

// ----- Basic Parsers ----- //

/**
 * Parses a value into a `string`.
 */
const stringParser: Parser<string> = parser((a) =>
	typeof a === 'string'
		? ok(a)
		: err(`Unable to parse ${String(a)} as a string`),
);

/**
 * Parses a value into a `number`.
 */
const numberParser: Parser<number> = parser((a) =>
	typeof a === 'number' && !isNaN(a)
		? ok(a)
		: err(`Unable to parse ${String(a)} as a number`),
);

/**
 * Parses a value into a `boolean`.
 */
const booleanParser: Parser<boolean> = parser((a) =>
	typeof a === 'boolean'
		? ok(a)
		: err(`Unable to parse ${String(a)} as a boolean`),
);

/**
 * Parses a value into a `Date`.
 */
const dateParser: Parser<Date> = parser((a) => {
	if (typeof a === 'string' || typeof a === 'number' || a instanceof Date) {
		const d = new Date(a);

		if (d.toString() === 'Invalid Date') {
			return err(`${String(a)} isn't a valid Date`);
		}

		return ok(d);
	}

	return err(`Can't transform ${String(a)} into a date`);
});

/**
 * Makes the value handled by the given parser optional. **Note:** This
 * will effectively absorb any failure to parse the value, converting it to
 * a `None` instead.
 *
 * @param pa A parser
 * @returns {Parser<Option<A>>} A new `Parser` with an optional value
 * @example
 * const json: unknown = JSON.parse('{ "foo": 42 }');
 *
 * const parserA = maybe(fieldParser('bar', numberParser)); // Parser<Option<number>>
 * const resultA = parse(parserA)(json); // Ok<None>
 *
 * const parserB = fieldParser('bar', maybe(numberParser)); // Parser<Option<number>>
 * const resultB = parse(parserB)(json); // Err<string>, with 'missing field' err
 */
const maybe = <A>(pa: Parser<A>): Parser<Option<A>> =>
	parser((a) => ok(toOption(pa.run(a))));

// ----- Data Structure Parsers ----- //

/**
 * Runs the parser `pa` over the value found at a given field in an object.
 * Will fail if the input isn't an object or the field is missing.
 *
 * @param field The field containing the value to parse
 * @param pa The parser to use on the field value
 * @returns {Parser<A>} A parser for the value at the given field
 * @example
 * const json: unknown = JSON.parse('{ "foo": 42 }');
 *
 * const parserA = fieldParser('foo', numberParser); // Parser<number>
 * const resultA = parse(parserA)(json); // Ok<number>, with value 42
 *
 * const parserB = fieldParser('bar', numberParser); // Parser<number>
 * const resultB = parse(parserB)(json); // Err<string>, with 'missing field' err
 */
const fieldParser = <A>(field: string, pa: Parser<A>): Parser<A> =>
	parser((a) => {
		if (!isObject(a)) {
			return err(
				`Can't lookup field '${field}' on something that isn't an object`,
			);
		}

		if (!(field in a)) {
			return err(`Field ${field} doesn't exist in ${String(a)}`);
		}

		return pa.run(a[field]);
	});

/**
 * Runs the parser `pa` over the value found at a given index in an array.
 * Will fail if the input isn't an array or the index is empty.
 *
 * @param index The array index containing the value to parse
 * @param pa The parser to use on the value at the given index
 * @returns {Parser<A>} A parser for the value at the given index
 * @example
 * const json: unknown = JSON.parse('[41, 42, 43]');
 *
 * const parserA = indexParser(1, numberParser); // Parser<number>
 * const resultA = parse(parserA)(json); // Ok<number>, with value 42
 *
 * const parserB = indexParser(7, numberParser); // Parser<number>
 * const resultB = parse(parserB)(json); // Err<string>, with 'missing index' err
 */
const indexParser = <A>(index: number, pa: Parser<A>): Parser<A> =>
	parser((a) => {
		if (!Array.isArray(a)) {
			return err(
				`Can't lookup index ${index} on something that isn't an Array`,
			);
		}

		const value: unknown = a[index];

		if (value === undefined) {
			return err(`Nothing found at index ${index}`);
		}

		return pa.run(value);
	});

/**
 * A convenience for parsing values in nested objects. Takes a list of fields
 * used to pinpoint a location within the nested objects.
 *
 * @param location Field names designating a location inside a nested object
 * @param pa The parser to use on the value at the location
 * @returns {Parser<A>} A parser for the value at the given location
 * @example
 * const json: unknown = JSON.parse('{ "foo": { "bar": 42 } }');
 *
 * const parser = locationParser(['foo', 'bar'], numberParser); // Parser<number>
 * const result = parse(parser)(json); // Ok<number>, with value 42
 */
const locationParser = <A>(location: string[], pa: Parser<A>): Parser<A> => {
	if (location.length === 0) {
		return pa;
	}

	const [head, ...tail] = location;

	return fieldParser(head, locationParser(tail, pa));
};

/**
 * Parses an array containing values of type `A`.
 * Will fail if the input isn't an array, or the values can't be parsed as `A`.
 *
 * @param pa A parser for the values in the array
 * @returns {Parser<A[]>} A parser for the array
 * @example
 * const json: unknown = JSON.parse('[41, 42, 43]');
 *
 * const parser = arrayParser(numberParser); // Parser<number[]>
 * const result = parse(parser)(json); // Ok<number[]>, with value [41, 42, 43]
 */
const arrayParser = <A>(pa: Parser<A>): Parser<A[]> =>
	parser((a) => {
		const f = (acc: A[], remainder: unknown[]): Result<string, A[]> => {
			if (remainder.length === 0) {
				return ok(acc);
			}

			const [item, ...tail] = remainder;
			const parsed = pa.run(item);

			if (parsed.kind === ResultKind.Ok) {
				return f([...acc, parsed.value], tail);
			}

			return err(
				`Could not parse array item ${String(item)} because ${
					parsed.err
				}`,
			);
		};

		if (Array.isArray(a)) {
			return f([], a);
		}

		return err(`Could not parse ${String(a)} as an array`);
	});

// ----- Combinator Functions ----- //

/**
 * Converts a `Parser` of `A` to a `Parser` of `B`. Will apply the given
 * function `f` to the result of the given parser (`Parser<A>`) if that parser
 * is successful.
 *
 * @param f The function to apply
 * @param pa The parser to convert
 * @returns {Parser<B>} A new parser for type `B`
 * @example
 * const parser = map(n => n + 1)(numberParser); // Parser<number>
 *
 * const valueA: unknown = 41;
 * const resultA = parse(parser)(valueA); // Ok<number>, with value 42
 *
 * const valueB: unknown = 'foo';
 * const resultB = parse(parser)(valueB); // Err<string>, with 'not a number' err
 */
const map =
	<A, B>(f: (a: A) => B) =>
	(pa: Parser<A>): Parser<B> =>
		parser((a) => resultMap(f)(pa.run(a)));

/**
 * Similar to `map`. Will apply the given function `f` to the results of two
 * given parsers (`Parser<A>` and `Parser<B>`) if both of those parsers are
 * successful.
 *
 * @param f A function with two arguments, `a` and `b`, which correspond to the
 * values potentially returned by the two parsers
 * @param pa The first parser, for a value of type `A`
 * @param pb The second parser, for a value of type `B`
 * @returns {Parser<C>} A new parser for type `C`
 * @example
 * type Person = { name: string, age: number };
 *
 * const makePerson = (name: string, age: number): Person => ({ name, age });
 * const personParser: Parser<Person> =
 *   map2(makePerson)(
 *     fieldParser('name', parseString),
 *     fieldParser('age', numberParser),
 *   );
 *
 * const jsonA: unknown = JSON.parse('{ "name": "CP Scott", "age": 85 }');
 * const resultA = parse(personParser)(jsonA); // Ok<Person>
 *
 * const jsonB: unknown = JSON.parse('{ "name": "CP Scott" }');
 * const resultB = parse(personParser)(jsonB); // Err<string>, 'missing field' err
 */
const map2 =
	<A, B, C>(f: (a: A, b: B) => C) =>
	(pa: Parser<A>, pb: Parser<B>): Parser<C> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			return ok(f(resultA.value, resultB.value));
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map3 =
	<A, B, C, D>(f: (a: A, b: B, c: C) => D) =>
	(pa: Parser<A>, pb: Parser<B>, pc: Parser<C>): Parser<D> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			return ok(f(resultA.value, resultB.value, resultC.value));
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map4 =
	<A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E) =>
	(pa: Parser<A>, pb: Parser<B>, pc: Parser<C>, pd: Parser<D>): Parser<E> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			const resultD = pd.run(a);

			if (resultD.kind === ResultKind.Err) {
				return resultD;
			}

			return ok(
				f(resultA.value, resultB.value, resultC.value, resultD.value),
			);
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map5 =
	<A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F) =>
	(
		pa: Parser<A>,
		pb: Parser<B>,
		pc: Parser<C>,
		pd: Parser<D>,
		pe: Parser<E>,
	): Parser<F> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			const resultD = pd.run(a);

			if (resultD.kind === ResultKind.Err) {
				return resultD;
			}

			const resultE = pe.run(a);

			if (resultE.kind === ResultKind.Err) {
				return resultE;
			}

			return ok(
				f(
					resultA.value,
					resultB.value,
					resultC.value,
					resultD.value,
					resultE.value,
				),
			);
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map6 =
	<A, B, C, D, E, F, G>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => G) =>
	(
		pa: Parser<A>,
		pb: Parser<B>,
		pc: Parser<C>,
		pd: Parser<D>,
		pe: Parser<E>,
		pf: Parser<F>,
	): Parser<G> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			const resultD = pd.run(a);

			if (resultD.kind === ResultKind.Err) {
				return resultD;
			}

			const resultE = pe.run(a);

			if (resultE.kind === ResultKind.Err) {
				return resultE;
			}

			const resultF = pf.run(a);

			if (resultF.kind === ResultKind.Err) {
				return resultF;
			}

			return ok(
				f(
					resultA.value,
					resultB.value,
					resultC.value,
					resultD.value,
					resultE.value,
					resultF.value,
				),
			);
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map7 =
	<A, B, C, D, E, F, G, H>(
		f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H,
	) =>
	(
		pa: Parser<A>,
		pb: Parser<B>,
		pc: Parser<C>,
		pd: Parser<D>,
		pe: Parser<E>,
		pf: Parser<F>,
		pg: Parser<G>,
	): Parser<H> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			const resultD = pd.run(a);

			if (resultD.kind === ResultKind.Err) {
				return resultD;
			}

			const resultE = pe.run(a);

			if (resultE.kind === ResultKind.Err) {
				return resultE;
			}

			const resultF = pf.run(a);

			if (resultF.kind === ResultKind.Err) {
				return resultF;
			}

			const resultG = pg.run(a);

			if (resultG.kind === ResultKind.Err) {
				return resultG;
			}

			return ok(
				f(
					resultA.value,
					resultB.value,
					resultC.value,
					resultD.value,
					resultE.value,
					resultF.value,
					resultG.value,
				),
			);
		});

/**
 * Similar to `map2`, but for more parsers. See the docs for that function for
 * more details and examples.
 */
const map8 =
	<A, B, C, D, E, F, G, H, I>(
		f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I,
	) =>
	(
		pa: Parser<A>,
		pb: Parser<B>,
		pc: Parser<C>,
		pd: Parser<D>,
		pe: Parser<E>,
		pf: Parser<F>,
		pg: Parser<G>,
		ph: Parser<H>,
	): Parser<I> =>
		parser((a) => {
			const resultA = pa.run(a);

			if (resultA.kind === ResultKind.Err) {
				return resultA;
			}

			const resultB = pb.run(a);

			if (resultB.kind === ResultKind.Err) {
				return resultB;
			}

			const resultC = pc.run(a);

			if (resultC.kind === ResultKind.Err) {
				return resultC;
			}

			const resultD = pd.run(a);

			if (resultD.kind === ResultKind.Err) {
				return resultD;
			}

			const resultE = pe.run(a);

			if (resultE.kind === ResultKind.Err) {
				return resultE;
			}

			const resultF = pf.run(a);

			if (resultF.kind === ResultKind.Err) {
				return resultF;
			}

			const resultG = pg.run(a);

			if (resultG.kind === ResultKind.Err) {
				return resultG;
			}

			const resultH = ph.run(a);

			if (resultH.kind === ResultKind.Err) {
				return resultH;
			}

			return ok(
				f(
					resultA.value,
					resultB.value,
					resultC.value,
					resultD.value,
					resultE.value,
					resultF.value,
					resultG.value,
					resultH.value,
				),
			);
		});

/**
 * Like `map` but applies a function that *also* returns an `Parser`. Then
 * "unwraps" the result for you so you don't end up with `Parser<Parser<A>>`.
 * Can be useful for stringing together multiple parsing steps, where each step
 * relies on the result of the previous one.
 *
 * If the first parser fails, the function won't be called and the error will
 * be returned instead. If the second parser fails the error for that will be
 * returned.
 *
 * @param f The function to apply
 * @param pa The parser whose result is to be passed to the function
 * @return {Parser<B>} A new parser, built from `pa` and `f`
 * @example
 * type MultipleChoiceAnswer = 'a' | 'b' | 'c';
 *
 * const answerValueParser = (value: string): Parser<MultipleChoiceAnswer> =>
 *   value === 'a' || value === 'b' || value === 'c'
 *     ? succeed(value)
 *     : fail("Needed 'a', 'b' or 'c'.");
 *
 * const answerParser = pipe(
 *   fieldParser('answer', parseString),
 *   andThen(answerValueParser),
 * );
 *
 * const jsonA: unknown = JSON.parse('{ "answer": "a" }');
 * const resultA = parse(answerParser)(jsonA); // Ok<MultipleChoiceAnswer>, 'a'
 *
 * const jsonB: unknown = JSON.parse('{ "answer": "d" }');
 * const resultB = parse(answerParser)(jsonB); // Err<string>, "Needed 'a', 'b' or 'c'."
 */
const andThen =
	<A, B>(f: (a: A) => Parser<B>) =>
	(pa: Parser<A>): Parser<B> =>
		parser((a) =>
			resultAndThen<string, A, B>((x) => f(x).run(a))(pa.run(a)),
		);

/**
 * Handles situations where there are multiple valid ways that the input data
 * can be structured. This will accept a list of parsers to try one after
 * another until a) one of them succeeds, or b) the end of the list is reached
 * with none successful. If none are successful then all the error messages
 * will be concatenated into a final error.
 *
 * @param parsers A list of parsers to try one after another
 * @returns {Parser<A>} A new parser for type `A`
 * @example
 * const stringAsNumberParser: Parser<number> = pipe(
 *   stringParser,
 *   map(parseFloat),
 *   andThen(numberParser),
 * );
 *
 * const parser = oneOf([numberParser, stringAsNumberParser]); // Parser<number>
 *
 * const jsonA: unknown = JSON.parse('42');
 * const resultA = parse(parser)(jsonA); // Ok<number>, 42
 *
 * const jsonB: unknown = JSON.parse('"42"');
 * const resultB = parse(parser)(jsonB); // Ok<number>, 42
 *
 * const jsonC: unknown = JSON.parse('null');
 * // Err<string>, "null is not a valid number. null is not a valid string"
 * const resultC = parse(parser)(jsonC);
 *
 * const jsonD: unknown = JSON.parse('"foo"');
 * // Err<string>, "'foo' is not a valid number. NaN is not a valid number"
 * const resultD = parse(parser)(jsonD);
 */
const oneOf = <A>(parsers: Array<Parser<A>>): Parser<A> =>
	parser((a) => {
		const f = (
			remainingParsers: Array<Parser<A>>,
			errs: string[],
		): Result<string, A> => {
			if (remainingParsers.length === 0) {
				return err(errs.join(' '));
			}

			const [head, ...tail] = remainingParsers;
			const result = head.run(a);

			if (result.kind === ResultKind.Ok) {
				return result;
			}

			return f(tail, [...errs, result.err]);
		};

		if (parsers.length === 0) {
			return err("The list of parsers passed to 'oneOf' was empty");
		}

		return f(parsers, []);
	});

// ----- Exports ----- //

export type { Parser };

export {
	succeed,
	fail,
	parse,
	stringParser,
	numberParser,
	booleanParser,
	dateParser,
	maybe,
	fieldParser,
	indexParser,
	locationParser,
	arrayParser,
	map,
	map2,
	map3,
	map4,
	map5,
	map6,
	map7,
	map8,
	andThen,
	oneOf,
};
