import app from '~/lib/app';
import { user } from '~/lib/records';

export default class Ema {
  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context) {}

  get userSession (): null | user.SessionSlice {
    return this.context.store.state.session.userSession;
  }

  get currentCountry (): null | user.CurrentCountrySlice {
    return this.context.store.state.session.currentCountry;
  }

  get locale (): string {
    return this.context.i18n.locale;
  }

  get localeIsEn () {
    return this.locale === 'en';
  }

  get intlLocale (): string {
    return app.locales.intlLocale(this.locale);
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
      this.locale, options,
    ).format(date);
  }
}
