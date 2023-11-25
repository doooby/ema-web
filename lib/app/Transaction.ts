import { Vue } from 'vue-property-decorator';

export default class Transaction {
  state: {
    isProcessing: boolean;
  };

  constructor (
    readonly onCommit: null | (() => void),
    readonly onCancel: null | (() => void),
  ) {
    this.state = Vue.observable({
      isProcessing: false,
    });
  }

  commit = () => this.onCommit?.();
  cancel = () => this.onCancel?.();
}
