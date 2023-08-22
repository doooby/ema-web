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

  onClear () {
    (this as any).onChangeValue({
      school: null,
      course: null,
      group: null,
    });
  }
}
</script>

<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <span>fdjshfjksdh</span>
    </template>
    <div
      :id="domIdBase"
      class="d-flex"
    >
      <div class="controls--nested-group flex-fill">
        <RecordAssociations
          :record="rawValue"
          :associations="associations"
        />
      </div>
      <div class="d-flex flex-column">
        <b-button
          v-if="rawValue.school"
          variant="outline-secondary"
          size="sm"
          @click="onClear"
        >
          <b-icon icon="x" />
        </b-button>
        <b-dropdown
          toggle-class="flex-fill"
          size="sm"
          no-caret
          right
        >
          <template #button-content>
            <b-icon icon="chevron-down" />
          </template>
          <template>
            <li>
              <SelectCourseGroup
                :value="rawValue"
                :dom-id="`${domIdBase}_attended_course`"
              />
            </li>
          </template>
        </b-dropdown>
      </div>
    </div>
  </b-form-group>
</template>
