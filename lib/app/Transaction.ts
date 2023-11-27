import { Vue } from 'vue-property-decorator';

export default class Transaction {
  state: {
    isProcessing: boolean;
  };

  constructor (
    readonly _onCommit: null | (() => void),
    readonly _onCancel: null | (() => void),
  ) {
    this.state = Vue.observable({
      isProcessing: false,
    });
  }

  commit = () => {
    if (!this.state.isProcessing) this._onCommit?.();
  };

  cancel = () => this._onCancel?.();
}
