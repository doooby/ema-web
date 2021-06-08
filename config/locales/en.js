export default {
  form: {
    field: {
      name: 'name',
    },
  },
  record: {
    countries: {
      meta: { s: 'country', p: 'countries' },
      id: 'id',
      name: 'name',
    },
    users: {
      meta: { s: 'user', p: 'users' },
      id: 'id',
      login: 'login',
      full_name: 'full name',
      country: 'country',
    },
    schools: {
      meta: { s: 'school', p: 'schools' },
      id: 'id',
      name: 'name',
      country: 'country',
      address: 'address',
    },
  },
  db: {
    browse: {
      search: 'search',
    },
    new: {
      title: 'new {entity}',
    },
  },
};
