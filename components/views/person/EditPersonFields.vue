<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';
import CaregiversField from '~/components/views/person/fields/caregiversField/CaregiversField.vue';
import {
  OptionsSelect, DateInput, NamesInputTable, TextInput,
} from '~/components/controls/inputs';

@Component({
  components: { NamesInputTable, CaregiversField, DateInput, OptionsSelect, TextInput },
})
export default class EditPersonFields extends Vue {
  @Prop({ required: true }) pageState!: app.page.State;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  options = new app.internals.Options();
  controls = controls.Group.new(
    'names',
    'born_on',
    'gender',
    'caregivers',
  );

  mounted () {
    this.controls.defaultsGet.ref = () => {
      return {
        names: [
          [ 'Kakarel' ],
          [ 'Mittel', 'Střední' ],
        ],
        gender: [ this.options.getByValue(this, 'gender', 'f') ],
        born_on: new Date(),
        caregivers: [
          {
            type: 'mother',
            names: [
              [ 'tetka', '1' ],
              [ 'Strejdović', '2' ],
            ],
            email: 'str@foo.bar',
          },
          {
            type: 'father',
            names: [
              [ 'Strejda' ],
              [ 'Strejdović' ],
            ],
          },
        ],
      };
    };
    this.controls.paramsGet.ref = (values: any) => {
      return {
        gender: values.gender?.[0]?.value,
      };
    };
    this.controls.reset();
  }

  get disabled () {
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
    <div class="col-md-6">
      <h3>
        <t value="person.EditPersonFields.section.person.title" />
      </h3>
      <div class="form-group">
        <label for="person_name--en">
          <t value="person.label.name" />
        </label>
        <NamesInputTable
          :value="controls.getValue('names')"
          dom-id="person_name"
          :disabled="disabled"
          @change="controls.update('names', $event)"
        />
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.gender" />
            </label>
            <OptionsSelect
              :value="controls.getValue('gender')"
              :options="options.getAll(this, 'gender')"
              :disabled="disabled"
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
              :disabled="disabled"
              @change="controls.update('born_on', $event)"
            />
          </div>
          <div class="form-group">
            <label>
              <t value="person.label.registered_on" />
            </label>
            <DateInput
              :value="controls.getValue('registered_on')"
              :disabled="disabled"
              @change="controls.update('registered_on', $event)"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.nationality" />
            </label>
            <OptionsSelect
              :value="controls.getValue('nationality')"
              :options="options.getAll(this, 'nationalities')"
              :disabled="disabled"
              @change="controls.update('nationality', $event)"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
          </div>
          <div class="form-group">
            <label for="person_citizen_id">
              <t value="person.label.citizen_id" />
            </label>
            <TextInput
              :disabled="disabled"
              dom-id="person_citizen_id"
              :value="controls.getValue('citizen_id')"
              @change="controls.update('citizen_id', $event)"
            />
          </div>
          <div class="form-group">
            <label for="person_passport_no">
              <t value="person.label.passport_no" />
            </label>
            <TextInput
              :disabled="disabled"
              dom-id="person_passport_no"
              :value="controls.getValue('passport_no')"
              @change="controls.update('passport_no', $event)"
            />
          </div>
          <div class="form-group">
            <label for="person_telephone_no">
              <t value="person.label.telephone_no" />
            </label>
            <TextInput
              :disabled="disabled"
              dom-id="person_telephone_no"
              :value="controls.getValue('telephone_no')"
              @change="controls.update('telephone_no', $event)"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.mother_tongue" />
            </label>
            <OptionsSelect
              :value="controls.getValue('mother_tongue')"
              :options="options.getAll(this, 'languages')"
              :disabled="disabled"
              @change="controls.update('mother_tongue', $event)"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.spoken_languages" />
            </label>
            <OptionsSelect
              :value="controls.getValue('spoken_languages')"
              :options="options.getAll(this, 'languages')"
              :disabled="disabled"
              @change="controls.update('spoken_languages', $event)"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h3>
        <t value="person.EditPersonFields.section.caregivers.title" />
      </h3>
      <div class="form-group">
        <CaregiversField
          :value="controls.getValue('caregivers')"
          :disabled="disabled"
          @change="controls.update('caregivers', $event)"
        />
      </div>
    </div>
    <div class="w-100" />
    <div class="col-md-6" />
  </div>
</template>
