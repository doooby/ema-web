export type Map<V> = Record<string, Maybe<V>>;

export type List<V> = Array<Maybe<V>>;

export type Maybe<V> = undefined | V;

export type Option = {
  value?: string;
  textKey: string;
} | {
  value?: string;
  text: string;
}

export type FilterableList<I> = (undefined | false | I)[]

export interface InternalOptionsList {
  id: string;
  options: string[];
}

export interface OptionItem<I=unknown> {
  value: string;
  item: I;
}
