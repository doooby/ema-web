import app from '~/lib/app';

export default class Ema {
  klass = Ema;

  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context) {}

  static readonly GLOBAL_DATE_LOCALE = 'en-UK';

  localizeDate (date: app.Maybe<Date>): app.Maybe<string> {
    if (!date) return;
    return new Intl.DateTimeFormat(this.klass.GLOBAL_DATE_LOCALE).format(date);
  }
}
