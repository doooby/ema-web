<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import {
  BRecordsSelect,
  NameInput,
  IntegerInput,
} from '~/components/controls/inputs';

@Component({
  components: {
    IntegerInput,
    NameInput,
    BRecordsSelect,
  },
})
export default class NewGroupFields extends Vue {
  @Prop({ required: true }) saveable!: app.page.SaveablePage;

  options = new app.internals.Options();

  created () {
    this.saveable.record = {
      name: [ '', '' ],
      term: 1,
      course: undefined,
    };
    this.saveable.getRecordParams = () => {
      const { record } = this.saveable;
      return {
        name: record.name,
        course_id: record.course?.[0]?.id,
        term: record.term,
      };
    };
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <b-form-group>
        <template #label>
          <t value="db.record.groups.label.course" />
        </template>
        <BRecordsSelect
          v-model="saveable.record.course"
          entity="courses"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.groups.label.name" />
        </template>
        <NameInput
          v-model="saveable.record.name"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.groups.label.term" />
        </template>
        <IntegerInput
          v-model="saveable.record.term"
        />
      </b-form-group>
    </div>
  </div>
</template>
