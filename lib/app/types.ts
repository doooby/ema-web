import app from '~/lib/app/index';

export type Map<V> = Record<string, Maybe<V>>;

//  TODO should be Array or SparseList
export type List<V> = Array<Maybe<V>>;
export type SparseList<V> = Array<Maybe<V>>;

export type Maybe<V> = undefined | V;

export type Nullable<V> = null | V;

export interface Ref<V> {
  ref: Maybe<V>;
}

export interface PageState {
  isLoading?: boolean;
  errorMessage?: string;
}

export type Option = {
  value?: string;
  textKey: string;
} | {
  value?: string;
  text: string;
}

export type PersonNames = app.SparseList<app.SparseList<string>>;

export type FilterableList<I> = (undefined | false | I)[]

export interface InternalOptionsList {
  id: string;
  options: string[];
}

export interface OptionItem<I=unknown> {
  value: string;
  item: I;
}

export type OptionItemsList<I=unknown> = Maybe<OptionItem<I>[]>;
