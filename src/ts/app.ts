/// <reference path="../../typings/angular2/angular2.d.ts" />

import {Injector, Component, View, bootstrap, NgFor} from 'angular2/angular2';
import {FriendsService} from './friends';

@Component({
  selector: 'my-app',
  bindings: [FriendsService]
})
@View({
  template: `
    <h1 *ng-for="#name of names">Hello {{ name }}</h1>
  `,
  directives: [NgFor]
})
// Component controller
export class MyAppComponent {
  names: string[];
  
  constructor(friendsService: FriendsService) {
    this.names = friendsService.names;
  }
}

bootstrap(MyAppComponent);
