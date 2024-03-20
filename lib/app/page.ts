import { ErrorMessage } from '~/lib/api2';
import app from '~/lib/app';

export interface Page {
  pageData: app.Maybe<app.Map<unknown>>;
  hasConnected: app.Maybe<boolean>;
  hasFailed: app.Maybe<boolean | string>;
  hasSucceeded: app.Maybe<boolean>;
}

// TODO deprecated
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

// TODO deprecated, use `.useSaveableRecord`
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

export interface State {
  isLoading?: boolean;
  errorMessage?: string;
}

export interface SaveableRecord {
  transaction: app.Transaction;
  record: app.Maybe<any>;
  changeParams: app.Maybe<app.Map<unknown>>;
  errors: app.Maybe<app.db.ErrorMessage[]>;
}

export function useSaveableRecord (context: any): SaveableRecord {
  return {
    transaction: new app.Transaction(
      () => context.onSave(),
      () => (
        typeof context.onSaveCancel === 'function'
          ? context.onSaveCancel()
          : context.$router.go(-1)
      ),
    ),
    record: undefined,
    changeParams: undefined,
    errors: undefined,
  };
}
