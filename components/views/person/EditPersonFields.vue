<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';
import NameInputsTable from '~/components/controls/inputs/extended/NameInputsTable.vue';
import OptionsSelect from '~/components/controls/inputs/base/OptionsSelect.vue';
import DateInput from '~/components/controls/inputs/base/DateInput.vue';
import CaregiversField from '~/components/views/person/fields/caregiversField/CaregiversField.vue';

@Component({
  components: { CaregiversField, DateInput, OptionsSelect, NameInputsTable },
})
export default class EditPersonFields extends Vue {
  static valuesToParams () {
    return {

    };
  }

  @Prop({ required: true }) pageState!: app.page.State;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  options = new app.internals.Options();
  controls = controls.Group.new(
    'name',
  );

  get isDisabled () {
    return this.pageState?.isLoading || this.transaction.state.isProcessing;
  }

  @Watch('controls.state.params')
  onParamsChanged () {
    this.$emit('change', this.controls.state.params);
  }
}
</script>

<template>
  <div class="row">
    <div class="col-md-6 min-form-column-width">
      <h3>
        <t value="person.EditPersonFields.section.person.title" />
      </h3>
      <div class="form-group">
        <label for="person_name--en">
          <t value="person.label.name" />
        </label>
        <NameInputsTable
          :value="controls.getValue('name')"
          dom-id="person_name"
          :disabled="isDisabled"
          @change="controls.update('name', $event)"
        />
      </div>
      <div class="form-group">
        <label>
          <t value="person.label.gender" />
        </label>
        <OptionsSelect
          :value="controls.getValue('gender')"
          :options="options.getAll(this, 'gender')"
          :disabled="isDisabled"
          @change="controls.update('gender', $event)"
        >
          <template #option-content="{ option, selected }">
            <input type="radio" :checked="selected" class="mr-1">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </div>
      <div class="form-group">
        <label>
          <t value="person.label.born_on" />
        </label>
        <DateInput
          :value="controls.getValue('born_on')"
          :disabled="isDisabled"
          @change="controls.update('born_on', $event)"
        />
      </div>
      <div class="form-group">
        <label>
          <t value="person.label.nationality" />
        </label>
        <OptionsSelect
          :value="controls.getValue('nationality')"
          :options="options.getAll(this, 'nationalities')"
          :disabled="isDisabled"
          @change="controls.update('nationality', $event)"
        >
          <template #option-content="{ option, selected }">
            <input type="radio" :checked="selected" class="mr-1">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </div>
      <div class="form-group">
        <label>
          <t value="person.label.mother_tongue" />
        </label>
        <OptionsSelect
          :value="controls.getValue('mother_tongue')"
          :options="options.getAll(this, 'languages')"
          :disabled="isDisabled"
          @change="controls.update('mother_tongue', $event)"
        >
          <template #option-content="{ option, selected }">
            <input type="radio" :checked="selected" class="mr-1">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </div>
    </div>
    <div class="col-md-6 min-form-column-width">
      <h3>
        <t value="person.EditPersonFields.section.caregivers.title" />
      </h3>
      <div class="form-group">
        <CaregiversField
          :value="controls.getValue('caregivers')"
          :disabled="isDisabled"
          @change="controls.update('caregivers', $event)"
        />
      </div>
    </div>
  </div>
</template>
