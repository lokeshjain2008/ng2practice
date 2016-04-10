import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef
} from 'angular2/core';

import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { bindActionCreators } from 'redux';

import * as SessionActions from '../actions/session';
import {loginUser, logoutUser} from '../actions/session';

import { RioAboutPage } from './about-page';
import { RioCounterPage } from './counter-page';

import {
  RioButton,
  RioNavigator,
  RioNavigatorItem,
  RioLogo,
  RioLoginModal
} from '../components';

@Component({
  selector: 'rio-sample-app',
  directives: [
    ROUTER_DIRECTIVES, RioNavigator, RioNavigatorItem,
    RioLoginModal, RioLogo, RioButton
  ],
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [require('../styles/index.css')],
  template: `
    <div>
      <rio-login-modal
        (onSubmit)="login($event)"
        [hasError]="session.get('hasError', false)"
        [isPending]="session.get('isLoading', false)"
        *ngIf="!isLoggedIn"></rio-login-modal>
      <rio-navigator>
        <rio-navigator-item [mr]=true>
          <rio-logo></rio-logo>
        </rio-navigator-item>
        <rio-navigator-item *ngIf="isLoggedIn" [mr]=true>
          <a [routerLink]="['Counter']"
            class="text-decoration-none">Counter</a>
        </rio-navigator-item>
        <rio-navigator-item *ngIf="isLoggedIn">
          <a [routerLink]="['About']"
            class="text-decoration-none">About Us</a>
        </rio-navigator-item>
        <div class="flex flex-auto"></div>
        <rio-navigator-item *ngIf="isLoggedIn" [mr]=true>
          {{
            session.getIn(['user', 'firstName'], '') + ' ' +
            session.getIn(['user', 'lastName'], '') }}
        </rio-navigator-item>
        <rio-navigator-item [hidden]="!isLoggedIn">
          <rio-button className="bg-red white" (click)="logout()" >
            Logout
          </rio-button>
        </rio-navigator-item>
      </rio-navigator>
      <main>
        <router-outlet *ngIf="isLoggedIn"></router-outlet>
      </main>
    </div>
  `
})
@RouteConfig([
  {
    path: '/counter',
    name: 'Counter',
    component: RioCounterPage,
    useAsDefault: true
  },
  {
    path: '/about',
    name: 'About',
    component: RioAboutPage
  }
])
export class RioSampleApp {
  private disconnect: Function;
  private unsubscribe: Function;
  private isLoggedIn: Boolean;
  private session: any;

  constructor(
    @Inject('ngRedux') private ngRedux,
    private applicationRef: ApplicationRef) {
  }

  ngOnInit() {
    this.disconnect = this.ngRedux.connect(
      this.mapStateToThis,
      this.mapDispatchToThis)(this);

    this.unsubscribe = this.ngRedux.subscribe(() => {
      this.applicationRef.tick();
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.disconnect();
  }

  mapStateToThis(state) {
    return {
      session: state.session,
      isLoggedIn: state.session.get('token', false)
    };
  }

  mapDispatchToThis(dispatch) {
    return {
      login: (credentials) => dispatch(loginUser(credentials)),
      logout: () => dispatch(logoutUser())
    };
  }
};
