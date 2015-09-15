/// <reference path="../../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, NgFor} from 'angular2/angular2';

@Component({
  selector: 'my-app'
})
@View({
  template: `
    <h1 *ng-for="#name of names">Hello {{ name }}</h1>
  `,
  directives: [NgFor]
})
// Component controller
class MyAppComponent {
  names: string[];
  
  constructor() {
    this.names = [
      'Alice', 'Bob', 'Charles'
    ];
  }
}

bootstrap(MyAppComponent);
