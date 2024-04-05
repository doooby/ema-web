<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import { BRecordsSelect } from '~/components/controls/inputs';
import app from '~/lib/app';

@Component({
  components: { BRecordsSelect },
})
export default class AddToCourseFields extends Vue {
    @Prop({ required: true }) pageState!: app.page.State
    @Prop({ required: true }) readonly transaction!: app.Transaction
    @Prop({ required: true }) readonly value!: app.api.Params

    controls = controls.Group.new()

    created () {
      this.controls.addField('school_select', () => ({
        onChange: (values) => {
          values.course_select = undefined
          values.group_select = undefined
        },
      }))
      this.controls.addField('course_select', () => ({
        onChange: (values) => {
          values.group_select = undefined
        },
      }))
      this.controls.paramsOverrideFn.ref = (values) => {
        return {
          id: values.course_select?.[0]?.id,
          group_id: values.group_select?.[0]?.id,
        }
      }
    }

    get disabled (): boolean {
      return !!(
        this.pageState?.isLoading ||
      this.pageState?.errorMessage ||
      this.transaction.state.isProcessing
      )
    }

    @Watch('controls.state.params')
    onParamsChanged () {
      this.$emit('input', this.controls.state.params)
    }

    get selectedSchoolId () {
      return this.controls.getValue('school_select')?.[0]?.id
    }

    get selectedCourseId () {
      return this.controls.getValue('course_select')?.[0]?.id
    }
}
</script>

<template>
  <div>
    <div class="form-group">
      <label>
        <t value="db.record.schools.meta.s" />
      </label>
      <BRecordsSelect
        :disabled="disabled"
        entity="schools"
        :value="controls.getValue('school_select')"
        @change="controls.update('school_select', $event)"
      />
    </div>
    <div class="form-group">
      <label>
        <t value="db.record.courses.meta.s" />
      </label>
      <BRecordsSelect
        :disabled="disabled || !selectedSchoolId"
        entity="courses"
        :value="controls.getValue('course_select')"
        :params="{ school_id: selectedSchoolId }"
        @change="controls.update('course_select', $event)"
      />
    </div>
    <div class="form-group">
      <label>
        <t value="db.record.groups.meta.s" />
      </label>
      <BRecordsSelect
        :disabled="disabled || !selectedCourseId"
        entity="groups"
        :value="controls.getValue('group_select')"
        :params="{ course_id: selectedCourseId }"
        @change="controls.update('group_select', $event)"
      />
    </div>
  </div>
</template>
