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
  semester_groups: { s: 'class', p: 'classes' },
  schools: { s: 'school', p: 'schools' },
  students: { s: 'student', p: 'students' },
  subjects: { s: 'subject', p: 'subjects' },
};

const common = {
  attendance: 'attendance',
  address: 'address',
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
      education_level: records.education_levels.s,
      name: shared.record.name,
      grade: 'grade',
      country: records.countries.s,
    },
    education_levels: {
      meta: records.education_levels,
      country: records.countries.s,
      id: shared.record.id,
      name: shared.record.name,
      level: 'level',
      start_age: 'start age',
      years_length: 'years length',
      semesters: 'semesters count',
    },
    semester_groups: {
      meta: records.semester_groups,
      id: shared.record.id,
      name: shared.record.name,
      year_start: 'year',
      semester: 'semester',
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
      born_on: 'Date of Birth',
      gender: 'Gender',
      language: 'Language',
      country: records.countries.s,
      attendance: common.attendance,
      name: shared.record.name,
      address: common.address,
      residency: 'Residency Status',
      distance_school_km: 'Distance to School (km)',
      distance_school_time: 'Distance to School (minutes)',
      caregivers_en: 'Parents / Caregivers EN',
      caregivers: 'Parents / Caregivers',
      caregivers_contact: 'Parents / Caregivers Contact',
      out_of_school: 'Out of School Before Enrolment',
      enrolment_on: 'Date of Enrolment',
      completion_on: 'Date of Completion',
      dropped_out_on: 'Date of Drop-out',
      drop_out_reason: 'Drop-out Reason',
      disability: 'Disability',
      disability_detail: {
        s: 'Status',
        d: 'Diagnosis',
        n: 'Assistance Needed',
        p: 'Assistance Provided',
      },
    },
    subjects: {
      meta: records.subjects,
      id: shared.record.id,
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
      index: 'Browse',
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
  misc: {
    language: {
      en: 'English',
    },
    distance: {
      km: 'Kilometers',
    },
    time: {
      min: 'Minutes',
    },
  },
};
