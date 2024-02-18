import { ErrorMessage } from '~/lib/api2';
import app from '~/lib/app';

export interface Page {
  pageData: app.Maybe<app.Map<unknown>>;
  hasConnected: app.Maybe<boolean>;
  hasFailed: app.Maybe<boolean | string>;
  hasSucceeded: app.Maybe<boolean>;
}

export function emptyState (): Page {
  return {
    pageData: undefined,
    hasConnected: false,
    hasFailed: false,
    hasSucceeded: false,
  };
}

export interface SaveablePage {
  transaction: app.Transaction;
  // TODO rename to model
  record: app.Map<any>;
  errors: app.Maybe<ErrorMessage[]>;
  getRecordParams: app.Maybe<() => app.Map<any>>;
}

// TODO deprecated, use `app.db.useSaveableResource`
export function saveableState (
  context: any,
): SaveablePage {
  return {
    transaction: new app.Transaction(
      () => context.onSave?.(),
      () => context.$router.go(-1),
    ),
    record: {},
    errors: undefined,
    getRecordParams: undefined,
  };
}
