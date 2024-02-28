import app from '~/lib/app';
import { user } from '~/lib/records';

export default class Admission {
  actions_index: app.Map<boolean> = {};

  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context: any) {}

  get admissible (): user.AdmissionActions {
    return this.context.$store.getters['session/admissionActions'];
  }

  canAction (actionName: string) {
    let can = this.actions_index[actionName];
    if (can !== undefined) return can;

    if (this.admissible.isRoot) {
      can = true;
    } else {
      can = this.admissible.resolve(actionName.split('/'));
    }

    this.actions_index[actionName] = can;
    return can;
  }
}
