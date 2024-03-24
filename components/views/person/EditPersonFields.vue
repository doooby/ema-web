<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';
import CaregiversField from '~/components/views/person/fields/caregiversField/CaregiversField.vue';
import {
  OptionsSelect, DateInput, NamesInputTable, TextInput, CheckBox, TextArea, IntegerInput,
} from '~/components/controls/inputs';

@Component({
  components: { IntegerInput, TextArea, CheckBox, NamesInputTable, CaregiversField, DateInput, OptionsSelect, TextInput },
})
export default class EditPersonFields extends Vue {
  @Prop({ required: true }) pageState!: app.page.State;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  options = new app.internals.Options();
  controls = controls.Group.new();

  created () {
    this.controls.paramsGet.ref = (values: any) => {
      return {
        gender: values.gender?.[0]?.value,
        residency_status: values.residency_status?.[0]?.value,
        nationality: values.nationality?.[0]?.value,
        mother_tongue: values.mother_tongue?.[0]?.value,
        spoken_languages: values.spoken_languages?.map(item => item.value),
        enrollment_reasons: values.enrollment_reasons?.map(item => item.value),
        disabilities: values.disabilities?.map(item => item.value),
        outside_school: values.outside_school?.[0]?.value,
        school_distance_km: values.school_distance_km?.[0]?.value,
        school_transport: values.school_transport?.[0]?.value,
        teaching_qualification: values.teaching_qualification?.[0]?.value,
      };
    };
  }

  get disabled () {
    return this.pageState?.isLoading || this.transaction.state.isProcessing;
  }

  get fieldsOptions () {
    return {
      disabilities: [
        ...this.options.getAll(this, 'disabilities'),
        app.country.defaults.options.otherOption(),
      ],
    };
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
        <t value="person.EditPersonFields.person" />
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
          <div class="form-group">
            <label>
              <t value="person.label.residency_status" />
            </label>
            <OptionsSelect
              :value="controls.getValue('residency_status')"
              :options="options.getAll(this, 'residency_status')"
              :disabled="disabled"
              @change="controls.update('residency_status', $event)"
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
              :disabled="disabled"
              :value="controls.getValue('spoken_languages')"
              :options="options.getAll(this, 'languages')"
              :multiple="true"
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
        <t value="person.EditPersonFields.enrollment" />
      </h3>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.enrolled_on" />
            </label>
            <DateInput
              :value="controls.getValue('enrolled_on')"
              :disabled="disabled"
              @change="controls.update('enrolled_on', $event)"
            />
          </div>
          <div class="form-group">
            <label>
              <t value="person.label.outside_school" />
            </label>
            <OptionsSelect
              :value="controls.getValue('outside_school')"
              :options="options.getAll(this, 'outside_school_terms')"
              :disabled="disabled"
              @change="controls.update('outside_school', $event)"
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
              <t value="person.label.enrollment_reasons" />
            </label>
            <OptionsSelect
              :disabled="disabled"
              :value="controls.getValue('enrollment_reasons')"
              :options="options.getAll(this, 'enrolment_reasons')"
              :multiple="true"
              :max-height="250"
              @change="controls.update('enrollment_reasons', $event)"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
          </div>
        </div>
      </div>
      <h3>
        <t value="person.EditPersonFields.disabilities" />
      </h3>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <OptionsSelect
              :disabled="disabled"
              :value="controls.getValue('disabilities')"
              :options="fieldsOptions.disabilities"
              :multiple="true"
              @change="controls.update('disabilities', $event)"
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
            <CheckBox
              :disabled="disabled"
              :value="controls.getValue('disability_diagnosis')"
              @change="controls.update('disability_diagnosis', $event)"
            >
              <t value="person.label.disability_diagnosis" />
            </CheckBox>
          </div>
          <div class="form-group">
            <CheckBox
              :disabled="disabled"
              :value="controls.getValue('assistance_needed')"
              @change="controls.update('assistance_needed', $event)"
            >
              <t value="person.label.assistance_needed" />
            </CheckBox>
          </div>
          <div class="form-group">
            <CheckBox
              :disabled="disabled"
              :value="controls.getValue('assistance_provided')"
              @change="controls.update('assistance_provided', $event)"
            >
              <t value="person.label.assistance_provided" />
            </CheckBox>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label>
              <t value="person.label.disability_note" />
            </label>
            <TextArea
              :disabled="disabled"
              :value="controls.getValue('disability_note')"
              @change="controls.update('disability_note', $event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12">
      <h3>
        <t value="person.EditPersonFields.caregivers" />
      </h3>
      <CaregiversField
        :value="controls.getValue('caregivers')"
        :disabled="disabled"
        @change="controls.update('caregivers', $event)"
      />
    </div>
    <div class="col-12">
      <h3>
        <t value="person.EditPersonFields.other" />
      </h3>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.external_id" />
            </label>
            <TextInput
              :disabled="disabled"
              :value="controls.getValue('external_id')"
              @change="controls.update('external_id', $event)"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.school_distance_min" />
            </label>
            <IntegerInput
              :disabled="disabled"
              :value="controls.getValue('school_distance_min')"
              @change="controls.update('school_distance_min', $event)"
            />
          </div>
          <div class="form-group">
            <label>
              <t value="person.label.school_distance_km" />
            </label>
            <OptionsSelect
              :disabled="disabled"
              :value="controls.getValue('school_distance_km')"
              :options="options.getAll(this, 'distance_to_school')"
              @change="controls.update('school_distance_km', $event)"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
          </div>
          <div class="form-group">
            <label>
              <t value="person.label.school_transport" />
            </label>
            <OptionsSelect
              :disabled="disabled"
              :value="controls.getValue('school_transport')"
              :options="options.getAll(this, 'school_transport')"
              @change="controls.update('school_transport', $event)"
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
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.navision_id" />
            </label>
            <TextInput
              :disabled="disabled"
              :value="controls.getValue('navision_id')"
              @change="controls.update('navision_id', $event)"
            />
          </div>
          <div class="form-group">
            <label>
              <t value="person.label.teaching_qualification" />
            </label>
            <OptionsSelect
              :disabled="disabled"
              :value="controls.getValue('teaching_qualification')"
              :options="options.getAll(this, 'teaching_qualifications')"
              @change="controls.update('teaching_qualification', $event)"
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
  </div>
</template>
