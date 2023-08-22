<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import ControlMixin from '~/components/Form/ControlMixin';
import SelectCourseGroup from '~/components/database/records/courses/controls/SelectCourseGroup.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectCourseGroup, RecordAssociations },
})
export default class AttendedCourse extends Vue {
  static fieldType: FormFieldType = {
    fillValues ({ name }, _, values) {
      values[name] = {
        school: null,
        course: null,
        group: null,
      };
    },
    fillParams ({ name }, values, record) {
      const value = values[name];
      if (value.school) {
        record[name] = {
          school_id: value.school?.id,
          course_id: value.course?.id,
          group_id: value.group?.id,
        };
      }
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  associations = [
    { entity: 'schools', attr: 'school' },
    { entity: 'courses', attr: 'course' },
    { entity: 'groups', attr: 'group' },
  ]
}
</script>

<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div
      :id="domIdBase"
      class="d-flex"
    >
      <div class="controls--nested-group flex-fill">
        <RecordAssociations
          :record="rawValue"
          :associations="associations"
          :new-tab="true"
        />
      </div>
      <b-dropdown
        size="sm"
        right
        offset="0"
        no-caret
        no-flip
      >
        <template #button-content>
          <b-icon icon="chevron-down" />
        </template>
        <b-dropdown-form>
          <SelectCourseGroup
            :value="rawValue"
            :dom-id="`${domIdBase}_attended_course`"
            :hide-message="true"
          />
        </b-dropdown-form>
      </b-dropdown>
    </div>
  </b-form-group>
</template>
