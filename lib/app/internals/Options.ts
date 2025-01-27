import app from '~/lib/app';
import { differenceBy, intersectionWith } from 'lodash';
import { Vue } from 'vue-property-decorator';

export default class Options {
  index: app.Map<app.OptionItem<string>[]> = {};

  cache: app.Map<app.OptionItem<string>[]> = {};

  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context: any) {}

  fillCache (lists: {
    name: string;
    other?: boolean;
  }[]) {
    for (const list of lists) {
      const options = this.getAll(this.context, list.name);
      if (list.other) {
        options.push(app.country.defaults.options.otherOption());
      }
      this.cache[list.name] = options;
    }
  }

  getAll (context: any, name: string): app.OptionItem<string>[] {
    if (!(name in this.index)) {
      Vue.set(this.index, name, this.buildList(context, name));
    }

    return this.index[name] ?? [];
  }

  getByValue (
    context: any,
    name: string,
    value?: string,
  ): app.Maybe<app.OptionItem<string>> {
    if (!value) return;

    return this.getAll(context, name).find(
      option => option.value === value,
    );
  }

  getByValues (context: any, name: string, values?: string[]): app.OptionItem<string>[] {
    if (!values?.length) return [];
    return intersectionWith(this.getAll(context, name), values, (listItem, value) => {
      return listItem.value === value;
    });
  }

  private buildList (context: any, name: string): app.OptionItem<string>[] {
    const countryData = context.$store.state.session.country;
    const options = countryData?.internalLists?.[name]?.options ?? [];
    return options.map(value => (Object.freeze({
      value,
      item: `app.internal_lists.${name}.${value}`,
    })));
  }

  static isSameList (
    list: app.OptionItemsList,
    comparee: app.OptionItemsList,
  ): boolean {
    return differenceBy(
      list ?? [],
      comparee ?? [],
      option => option.value,
    ).length === 0;
  }
}
