import {
  Component,
  effect,
  input,
  linkedSignal,
  numberAttribute,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'example',
  template: `Inside component: {{ values() }}`,
})
export class Example {
  valueInput = input(0, {
    alias: 'value',
    transform: numberAttribute,
  });

  value = linkedSignal(this.valueInput);

  valuesEffect = effect(() =>
    this.values.set([
      ...untracked(this.values),
      [this.valueInput(), this.value()].join(),
    ])
  );

  values = signal<string[]>([]);
}

@Component({
  selector: 'app-root',
  imports: [Example],
  template: `
    <p>
      When is the exact timing of the first read of the effect?

      <br />

      Example 1: With a literal value for a input, we see 1 execution of the
      effect with the input value of 1, the default value of 0 was not read.

      <br />

      Example 2: With a property binding for a input, we see 2 executions of the
      effect with the input value of 2 AND the default value of 0 was read.

      <br />

      I guess the expected behavior is that the effect should only run once with
      the input value of 2, since it was set from the very beginning, but
      observation is that the effect resolved before the input has been set,
      therefore we see 2 executions of the effect.
    </p>

    <example #example1 value="1" />
    <div>Outside Component: {{ values1() }}</div>
    <div>
      Current Value via a view child reference:
      {{ [this.example1().valueInput(), this.example1().value()].join() }}
    </div>

    <br />

    <example #example2 [value]="2" />
    <div>Outside Component: {{ values2() }}</div>
    <div>
      Current Value via a view child reference:
      {{ [this.example2().valueInput(), this.example2().value()].join() }}
    </div>
  `,
})
export class App {
  example1 = viewChild.required('example1', { read: Example });
  example2 = viewChild.required('example2', { read: Example });

  values1 = signal<string[]>([]);
  values2 = signal<string[]>([]);

  values1Effect = effect(() =>
    this.values1.set([
      ...untracked(this.values1),
      [this.example1().valueInput(), this.example1().value()].join(),
    ])
  );

  values2Effect = effect(() =>
    this.values2.set([
      ...untracked(this.values2),
      [this.example2().valueInput(), this.example2().value()].join(),
    ])
  );
}

bootstrapApplication(App).catch((err) => console.error(err));
