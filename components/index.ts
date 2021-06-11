import Vue, { VNode } from 'vue';

export function buildPage<V, D extends { [key: string]: any }> (
  component: V,
  layout: string,
  data: D,
) {
  const propsNames = Object.keys(data);
  return Vue.extend({
    // @ts-ignore // layout is not defined for functional component
    functional: true,
    layout,
    render (createElement): VNode {
      const props = {} as { [key: string]: any };
      for (const name of propsNames) props[name] = data[name];
      return createElement(component, { props });
    },
  });
}

export function buildDatabasePage<V, D> (component: V, data: D) {
  return buildPage(component, 'database', data);
}
