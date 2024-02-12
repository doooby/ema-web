import app from '~/lib/app';
import { intersectionWith } from 'lodash';

export default class Options {
  index: app.Map<app.OptionItem<string>[]> = {};

  getAll (context: any, name: string): app.OptionItem<string>[] {
    if (!(name in this.index)) {
      this.index[name] = this.buildList(context, name);
    }

    return this.index[name] ?? [];
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
    return options.map(value => ({
      value,
      item: `app.internal_lists.${name}.${value}`,
    }));
  }
}
