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
  education_levels: { s: 'education level', p: 'education levels' },
  groups: { s: 'group', p: 'groups' },
  schools: { s: 'school', p: 'schools' },
  students: { s: 'student', p: 'students' },
};

const common = {
  attendance: 'attendance',
};

export default {
  gender: {
    m: 'Male',
    f: 'Female',
    other: 'Other',
  },
  form: {
    field: {
      name: 'name',
      date: {
        day: 'Day',
        month: 'Month',
        year: 'Year',
      },
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
    education_levels: {
      meta: records.education_levels,
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
      attendance: common.attendance,
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
      first_name_en: 'First Name EN',
      last_name_en: 'Last Name EN',
      first_name: 'First Name',
      last_name: 'Last Name',
      born_at: 'Date of Birth',
      gender: 'Gender',
      language: 'Language',
      country: records.countries.s,
      attendance: common.attendance,
      name: shared.record.name,
    },
  },
  db: {
    shared: {
      edit: 'Edit',
      loading: '...loading',
      processing: '...processing',
      record_not_found: 'Record not found.',
      save: 'Save',
      show: 'Show',
      records_count: 'Records Count',
      filter: 'Filter',
    },
    top_bar: {
      home: 'Home',
      logo: 'Home Page',
      db: 'Database',
      menu: {
        login: 'Login',
        logout: 'Logout',
        language: 'language',
      },
    },
    menu: {
      index_link: 'Index Page',
      search_placeholder: 'search resource',
    },
    pages: {
      browse: 'Browse',
      new: 'Add New Record',
      groups: {
        edit_students: 'Edit Students',
      },
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
