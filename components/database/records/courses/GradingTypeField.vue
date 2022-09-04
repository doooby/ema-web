<template>
  <b-form-group
    :label-for="`${domIdBase}_min`"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <course-grading
      :dom-id="domIdBase"
      :value="formValues[field.name]"
      @change="onChangeValue($event)"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import CourseGrading from '~/components/database/controls/primitives/CourseGrading.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { CourseGrading },
})
export default class GradingTypeField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ '', '' ];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;
}
</script>
