export default class AdmissionActions {
  _actions: any;

  isRoot: boolean = false;

  constructor (value) {
    this._actions = value;
  }

  static parse (value) {
    const instance = new AdmissionActions(value);
    if (typeof value === 'object' && value._is_root) {
      instance.isRoot = true;
    }
    return Object.freeze(instance);
  }

  resolve (parts: string[]): boolean {
    if (this.isRoot) return true;

    let pointer: any = this._actions;
    const len = parts.length;
    const lastI = parts.length - 1;
    for (let i = 0; i < len; i += 1) {
      const part = parts[i];
      const isLast = i === lastI;
      if (isLast) {
        return !!(
          Array.isArray(pointer) &&
          pointer.includes(part)
        );
      }

      if (!pointer?.[part]) {
        return false;
      }

      pointer = pointer[part];
    }

    return false;
  }
}
