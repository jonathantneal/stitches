import Benchmark from 'benchmark';
const suite = new Benchmark.Suite();
import { tokenizeValue } from '../src/shorthand-parser/value-tokenizer';

suite.add('Benchmark 1', () => {
	tokenizeValue(undefined as any)
});

suite.add('Benchmark 2', () => {
	tokenizeValue('solid red')
});

suite.on('cycle', event => {
	console.log(String(event.target));
})

suite.run();
