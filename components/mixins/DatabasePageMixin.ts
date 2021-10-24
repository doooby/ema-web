import { Context } from '@nuxt/types';

interface Page {
  entity: string;
  action: string;
}

const DatabasePageMixin = {
  layout: 'database',
  async asyncData ({ app, route, store }: Context) {
    const page = parseRoute(route.path);

    const session = await app.$api.request(
      app.$api.queries.session.show(page),
      app.$api.newQueryState(),
    );

    store.commit('dbPage/setPage', {
      ...page,
      allowed: !!(session?.pageAllowed),
    });

    if (session) {
      store.commit('user/setCurrentUser', session.user);
    }
  },
};

export default DatabasePageMixin;

function parseRoute (path: string): Page {
  const groups = path.match(/^\/database\/(\w+)(?:\/([\w\d]+))?\/?/);
  return {
    entity: groups?.[1] ?? 'unknown',
    action: groups?.[2] ?? 'index',
  };
}
