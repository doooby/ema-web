<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { course } from '~/lib/records';

@Component
export default class SubjectColumnField extends Vue {
  @Prop({ required: true }) readonly grading!: course.grading.GradingDefinition;
  @Prop({ required: true }) readonly originalValue!: unknown;
  @Prop({ required: true }) readonly value!: undefined | string;

  get sanitizedValue (): string {
    const currentValue = this.value ?? this.originalValue;
    if (
      typeof currentValue === 'string' &&
      this.grading.options?.includes(currentValue)
    ) return currentValue;
    else return '';
  }

  get fulfilled () {
    if (this.grading.requiredIndex) {
      const index = this.grading.options.indexOf(this.sanitizedValue);
      return index >= this.grading.requiredIndex;
    }
    return true;
  }
}

</script>

<template>
  <div class="d-flex align-items-center px-2">
    <b-form-select
      :class="['grade_input', value !== undefined && 'border-warning']"
      :options="grading.options ?? []"
      :value="sanitizedValue"
      @change="$emit('change', $event)"
    />
    <b-icon
      v-if="grading.requiredIndex && fulfilled"
      class="ml-1 text-muted"
      icon="check-circle"
    />
  </div>
</template>

<style scoped>
.grade_input {
  width: 60px
}
</style>
