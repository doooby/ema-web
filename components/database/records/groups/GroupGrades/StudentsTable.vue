<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { DataTable } from '~/components/toolkit/DataTable';
import { wai } from '~/vendor/wai';
import { student } from '~/lib/records';
import controls from '~/components/controls';

function parseStudent (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
  }));
}

type Student = ReturnType<typeof parseStudent>;

@Component
export default class StudentsTable extends Vue {
  @Prop({ required: true }) readonly form!: controls.Group;

  students = new app.db.Records<Student>({
    params: {
      staticParams: {
        slices: [ 'header' ],
      },
      listingParams: {
        page: 1,
        per_page: 100,
        order_by: [ [ 'first_name_lo', 'ASC' ] ],
      },
    },
  });

  get columns () {
    return DataTable.flattenColumns(
      {
        name: 'person',
        size: 250,
        headerText: 'database.records.groups.GroupGrades.column.person',
      },
    );
  }
}
</script>

<template>
  <div>
  </div>
</template>
