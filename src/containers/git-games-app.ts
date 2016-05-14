import {Component} from 'angular2/core';
import {RepoFinder} from '../components/repo-finder';

@Component({
  selector: 'git-games-app',
  template: require('./git-games-app.tmpl.html'),
  directives: [RepoFinder]
})
export class GitGamesApp {
};
