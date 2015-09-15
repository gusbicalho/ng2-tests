/// <reference path="../../typings/angular2/angular2.d.ts" />
import 'zone.js';
import 'reflect-metadata';

import {Component, View, bootstrap,
        NgFor} from 'angular2/angular2';
import {FriendsService} from './friends';
import {FoesService} from './foes';

@Component({
  selector: 'my-app',
  bindings: [FriendsService, FoesService]
})
@View({
  templateUrl: 'scripts/app.tpl.html',
  directives: [NgFor]
})
export class MyAppComponent {
  names: string[];
  
  constructor(public friends: FriendsService,
              public foes: FoesService) {}
}

bootstrap(MyAppComponent);
