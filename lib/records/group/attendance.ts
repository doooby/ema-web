import { wai } from '~/vendor/wai';
import { api } from '~/lib/api2/module';

export interface WeekAttendance {
  students: Record<string, undefined | (undefined | string)[]>;
}

function parseWeekAttendance (
  value,
  _associations: wai.Associations,
): WeekAttendance {
  return wai.object(value => ({
    students: wai.property(value, 'students',
      wai.indexOf(
        wai.nullable(wai.listOf(
          wai.nullable(wai.string),
        )),
      ),
    ),
  }))(value);
}

export const queries = {

  show ({
    group_id,
    date,
  }: api.Params) {
    return new api.Query({
      pathIsFull: true,
      path: `/v3/groups/${group_id}/attendance/show_week`,
      params: { date },
      reducer: value => wai.recordShow(value, parseWeekAttendance),
    });
  },

  update ({
    group_id,
    date,
    students,
  }: api.Params) {
    return new api.Query({
      pathIsFull: true,
      path: `/v3/groups/${group_id}/attendance/update_week`,
      params: { date, record: { students } },
      reducer: wai.recordUpdate,
    });
  },

};
