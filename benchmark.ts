import Benchmark from 'benchmark';
import glob from 'tiny-glob';
import { resolve } from 'path';

/** Benchmark suites to be added by benchmark files. */
const suites: Set<Benchmark.Suite> = new Set();

// define a global `describe` function that maps to BenchmarkJS
Reflect.set(globalThis, 'describe', (name: string, fn: Function) => {
  /** Benchmark suite. */
  const suite = new Benchmark.Suite(name);
  suite.on('cycle', (event: { target: string }) => console.log(`${name}: ${event.target}`));
  suites.add(suite);

  // preserve global `test`
  const preservedGlobalTest = Reflect.get(globalThis, 'test');

  // define a global `test` function that maps to this benchmark suite
  Reflect.set(globalThis, 'test', suite.add.bind(suite));

  // run this benchmark suite initializing function.
  fn();

  // Restore global `test`
  Reflect.set(globalThis, 'test', preservedGlobalTest);
});

// collect all benchmark tests
glob('**/*.benchmark.ts')
  // prepare all benchmark tests
  .then((files: string[]) => Promise.all(files.map((file) => import(resolve(file)))))
  // run all benchmark tests
  .then(() => suites.forEach((suite) => suite.run()));
