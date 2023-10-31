import { Context } from '@nuxt/types';

export class Admission {
  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context: Context) {}

  can (entityAction): boolean {
    const [ entity, action ] = entityAction.split('.');
    const admissible = this.context.store.getters['session/admissibleActions'];
    if (admissible.is_root?.length) return true;
    return !!admissible[entity]?.includes(action);
  }

  indexCan (...entityActions): Record<string, boolean> {
    const admissible = this.context.store.getters['session/admissibleActions'];
    const index: Record<string, boolean> = {};
    const isRoot = !!admissible.is_root?.length;
    for (const entityAction of entityActions) {
      let can;
      if (isRoot) {
        can = true;
      } else {
        const [ entity, action ] = entityAction.split('.');
        can = !!admissible[entity]?.includes(action);
      }
      index[entityAction] = can;
      if (can) index.canAny = true;
    }
    return index;
  }
}

export default (context: Context, inject: (key: string, value) => void) => {
  inject('admission', Object.freeze(new Admission(context)));
};

declare module 'vue/types/vue' {
  interface Vue {
    $admission: Admission;
  }
}
