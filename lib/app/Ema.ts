import app from '~/lib/app';
import { user } from '~/lib/records';

export default class Ema {
  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context) {}

  get currentCountry (): null | user.CurrentCountrySlice {
    return this.context.store.state.session.currentCountry;
  }

  get userSession (): null | user.SessionSlice {
    return this.context.store.state.session.userSession;
  }

  get admissionActions (): user.AdmissionActions {
    return this.context.store.getters['session/admissionActions'];
  }

  get locale (): string {
    return this.context.i18n.locale;
  }

  get intlLocale (): string {
    return app.locales.intlLocale(this.locale);
  }

  get intlDateLocale (): string {
    return app.locales.intlDateLocale(this.locale);
  }

  get intlDateLocaleIsEnUk (): boolean {
    return this.intlDateLocale === app.locales.INTL_GLOBAL;
  }

  setLocale (locale: string): void {
    this.context.i18n.setLocale(locale);
  }

  localizeDate (
    date: app.Maybe<Date>,
    options = undefined,
  ): app.Maybe<string> {
    if (!date) return;
    return app.locales.createDateTimeFormat(
      this.intlDateLocale, options,
    ).format(date);
  }

  canI (action: string): boolean {
    if (this.admissionActions?.isRoot) return true;

    if (action.startsWith('act:/')) {
      const parts = action.substring(5).split('/');
      return this.admissionActions?.resolve(parts) ?? false;
    }

    return false;
  }

  canIAny (actions: string[]): boolean {
    for (const action of actions) {
      if (this.canI(action)) return true;
    }

    return false;
  }
}
