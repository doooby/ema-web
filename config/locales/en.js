const shared = {
  record: {
    id: 'id',
    name: 'name',
  },
};

const records = {
  countries: { s: 'country', p: 'countries' },
  users: { s: 'user', p: 'users' },
  courses: { s: 'course', p: 'courses' },
  educational_levels: { s: 'educational level', p: 'educational levels' },
  groups: { s: 'group', p: 'groups' },
  schools: { s: 'school', p: 'schools' },
  students: { s: 'student', p: 'students' },
};

export default {
  form: {
    field: {
      name: 'name',
    },
    actions: {

    },
  },
  record: {
    countries: {
      meta: records.countries,
      id: shared.record.id,
      name: shared.record.name,
    },
    users: {
      meta: records.users,
      id: shared.record.id,
      login: 'login',
      full_name: shared.record.name,
      country: records.countries.s,
    },
    courses: {
      meta: records.courses,
      id: shared.record.id,
      name: shared.record.name,
      country: records.countries.s,
    },
    educational_levels: {
      meta: records.educational_levels,
      id: shared.record.id,
      order: 'order',
      name: shared.record.name,
      start_age: 'start_age',
      years_length: 'years_length',
    },
    groups: {
      meta: records.groups,
      id: shared.record.id,
      name: shared.record.name,
      year: 'year',
      course: records.courses.s,
      school: records.schools.s,
      students: records.students.p,
    },
    schools: {
      meta: records.schools,
      id: shared.record.id,
      name: shared.record.name,
      country: records.countries.s,
      address: 'address',
    },
    students: {
      meta: records.students,
      id: shared.record.id,
      full_name: 'full name',
      country: records.countries.s,
    },
  },
  db: {
    shared: {
      edit: 'Edit',
      loading: '...loading the record',
      processing: '...processing',
      record_not_found: 'Record not found.',
      save: 'Save',
      show: 'Show',
    },
    menu: {
      index_link: 'Index Page',
      search_placeholder: 'search resource',
    },
    pages: {
      browse: 'Browse',
      new: 'Add New Record',
    },
    browse: {
      search: 'search',
    },
    new: {
      title: 'new {entity}',
    },
    edit: {
      title: 'edit {entity}',
    },
  },
};
