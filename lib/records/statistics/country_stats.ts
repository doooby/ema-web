import { api } from '~/lib/api2/module';
import { wai } from '~/vendor/wai';

export const queries = {

  show_country_homepage_data () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/statistics/show_country_homepage_data',
      reducer: value => wai.recordShow(value, parse__show_country_homepage_data),
    });
  },

};

function parse__show_country_homepage_data (value) {
  return wai.object(value => ({

    main: wai.prop('main', value, wai.object(value => ({

      students: wai.prop('students', value, wai.object(value => ({
        boys: wai.prop('boys', value, wai.integer),
        girls: wai.prop('girls', value, wai.integer),
      }))),

      schools: wai.prop('schools', value, wai.object(value => ({
        formal: wai.prop('formal', value, wai.integer),
        non_formal: wai.prop('non_formal', value, wai.integer),
      }))),

    }))),

  }))(value);
}
