import {
  Component,
  effect,
  input,
  linkedSignal,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'example',
  template: `Inside component: {{ values }}`,
})
export class Example {
  valueInput = input(0, {
    alias: 'value',
    transform: numberAttribute,
  });

  value = linkedSignal(this.valueInput);

  valuesEffect = effect(() =>
    this.values.push([this.valueInput(), this.value()].join())
  );

  values: string[] = [];
}

@Component({
  selector: 'app-root',
  imports: [Example],
  template: `
    <ul>
      <li>
        Why is the effect not triggered when property binding syntax is used?
      </li>
      <li>
        Is there a different timing in the first execution of the effect
        depending? Is there a semantic difference in property binding vs passing
        a literal value in that aspect?
      </li>
      <li>When are effects executed for the first time in a component?</li>
    </ul>

    <example #example1 value="1" />
    <div>Outside Component: {{ values1 }}</div>
    <div>
      Current Value via a view child reference:
      {{ [this.example1().valueInput(), this.example1().value()].join() }}
    </div>

    <br />

    <example #example2 [value]="2" />
    <div>Outside Component: {{ values2 }}</div>
    <div>
      Current Value via a view child reference:
      {{ [this.example2().valueInput(), this.example2().value()].join() }}
    </div>
  `,
})
export class App {
  example1 = viewChild.required('example1', { read: Example });
  example2 = viewChild.required('example2', { read: Example });

  values1: string[] = [];
  values2: string[] = [];

  values1Effect = effect(() =>
    this.values1.push(
      [this.example1().valueInput(), this.example1().value()].join()
    )
  );

  values2Effect = effect(() =>
    this.values2.push(
      [this.example2().valueInput(), this.example2().value()].join()
    )
  );
}

bootstrapApplication(App).catch((err) => console.error(err));
