<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import HideableControls from '~/components/views/toolkit/HideableControls.vue';
import OptionsSelect from '~/components/controls/inputs/base/OptionsSelect.vue';
import RecordName from '~/components/views/application/RecordName.vue';
import app from '~/lib/app';

@Component({
  components: {
    RecordName,
    OptionsSelect,
    HideableControls,
  },
})
export default class AdditionalControls extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly pageState!: app.PageState;

  options = new app.internals.Options(this);

  get subjectsAllValue () {
    const selectedSubjects = (this.controls.getValue('subjects') as app.OptionItemsList) ?? [];
    const allSubjects = this.controls.getField('subjects')?.options ?? [];
    const subjectsAllOptions = this.options.getAll(this, 'options_all_none');

    if (allSubjects.length === 0) return;

    if (selectedSubjects.length === 0) {
      return [ subjectsAllOptions.find(option => option.value === 'none') ];
    }

    if (app.internals.Options.isSameList(
      allSubjects, selectedSubjects,
    )) {
      return [ subjectsAllOptions.find(option => option.value === 'all') ];
    }
  }

  onChangeSubjectsAll (value: app.OptionItem[]) {
    switch (value?.[0]?.value) {
      case 'none':
        this.controls.update('subjects', []);
        break;
      case 'all':
        this.controls.update(
          'subjects',
          this.controls.getField('subjects')?.options,
        );
        break;
    }
  }
}
</script>

<template>
  <HideableControls
    class="mb-3"
    name="records--groups--GroupGrades"
  >
    <b-form-group
      class="col-md-4 col-lg-3"
      label-for="grades__subjects"
    >
      <template #label>
        <t value="database.groups.GroupsGrades.filters.subjects.label" />
      </template>
      <OptionsSelect
        :value="controls.getValue('subjects')"
        :multiple="true"
        :options="controls.getField('subjects')?.options ?? []"
        :max-height="200"
        :disabled="pageState?.isLoading"
        @change="controls.update('subjects', $event)"
      >
        <template #option-content="{ option }">
          <RecordName
            class="flex-fill"
            :names="option && [
              option.item.subject.caption,
              option.item.subject.name,
            ]"
          />
        </template>
      </OptionsSelect>
    </b-form-group>
    <b-form-group
      class="col-md-4 col-lg-3"
      label-for="grades__subjects"
    >
      <template #label>
        <t value="database.groups.GroupsGrades.filters.subjects.label" />
      </template>
      <OptionsSelect
        :value="subjectsAllValue"
        :options="options.getAll(this, 'options_all_none')"
        @change="onChangeSubjectsAll"
      >
        <template #option-content="{ option, selected }">
          <input type="radio" :checked="selected" class="mr-1">
          <t :value="option.item" />
        </template>
      </OptionsSelect>
    </b-form-group>
    <div style="margin-top: -16px" />
  </HideableControls>
</template>
