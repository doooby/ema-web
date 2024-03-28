<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';
import CaregiversField from '~/components/views/person/fields/caregiversField/CaregiversField.vue';
import {
  OptionsSelect, DateInput, NamesInputTable,
  TextInput, CheckBox, TextArea, IntegerInput, LocationInput,
} from '~/components/controls/inputs';
import { person } from '~/lib/records';

@Component({
  components: {
    LocationInput,
    IntegerInput,
    TextArea,
    CheckBox,
    NamesInputTable,
    CaregiversField,
    DateInput,
    OptionsSelect,
    TextInput,
  },
})
export default class EditPersonFields extends Vue {
  @Prop({ required: true }) pageState!: app.page.State;
  @Prop() person?: ReturnType<typeof person.parseRecordSlice>;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  options = new app.internals.Options(this);
  controls = controls.Group.new();

  created () {
    this.options.fillCache([
      { name: 'gender' },
      { name: 'nationalities' },
      { name: 'languages' },
      { name: 'outside_school_terms' },
      { name: 'teaching_qualifications' },
      { name: 'distance_to_school' },
      { name: 'enrolment_reasons' },
      { name: 'disabilities', other: true },
      { name: 'school_transport', other: true },
      { name: 'residency_status', other: true },
    ]);

    this.controls.paramsGet.ref = (values) => {
      return app.forms.valuesToParams(values, {
        names: value => value,
        citizen_id: value => value,
        external_id: value => value,
        passport_no: value => value,
        telephone_no: value => value,
        disability_note: value => value,
        navision_id: value => value,
        school_distance_min: value => value,
        disability_diagnosis: value => value,
        assistance_needed: value => value,
        assistance_provided: value => value,
        birthplace_address: value => value,
        address: value => value,
        gender: app.forms.optionToParam,
        nationality: app.forms.optionToParam,
        mother_tongue: app.forms.optionToParam,
        outside_school: app.forms.optionToParam,
        school_distance_km: app.forms.optionToParam,
        teaching_qualification: app.forms.optionToParam,
        spoken_languages: app.forms.optionsToParam,
        enrollment_reasons: app.forms.optionsToParam,
        disabilities: app.forms.optionsToParam,
        registered_on: app.forms.dateToParam,
        enrolled_on: app.forms.dateToParam,
        born_on: app.forms.dateToParam,
        residency_status: app.forms.optionOrFillToParam,
        school_transport: app.forms.optionOrFillToParam,
        caregivers: value => value,
      });
    };
  }

  @Watch('person')
  onPersonChange (value) {
    this.controls.defaultsGet.ref = () => {
      return app.forms.valuesForRecord(value, {
        names: value => value,
        born_on: value => value,
        registered_on: value => value,
        enrolled_on: value => value,
        citizen_id: value => value,
        passport_no: value => value,
        telephone_no: value => value,
        disability_note: value => value,
        navision_id: value => value,
        external_id: value => value,
        school_distance_min: value => value,
        disability_diagnosis: value => value,
        assistance_needed: value => value,
        assistance_provided: value => value,
        birthplace_address: value => value,
        address: value => value,
        caregivers: value => value,
        gender: value => app.forms.valueForOption(value, this.options.cache.gender),
        nationality: value => app.forms.valueForOption(value, this.options.cache.nationalities),
        mother_tongue: value => app.forms.valueForOption(value, this.options.cache.languages),
        outside_school: value => app.forms.valueForOption(value, this.options.cache.outside_school_terms),
        teaching_qualification: value => app.forms.valueForOption(value, this.options.cache.teaching_qualifications),
        school_distance_km: value => app.forms.valueForOption(value, this.options.cache.distance_to_school),
        spoken_languages: value => app.forms.valueForOptions(value, this.options.cache.languages),
        enrollment_reasons: value => app.forms.valueForOptions(value, this.options.cache.enrolment_reasons),
        disabilities: value => app.forms.valueForOptions(value, this.options.cache.disabilities),
        school_transport: value => app.forms.valueForOptionOrFill(value, this.options.cache.school_transport),
        residency_status: value => app.forms.valueForOptionOrFill(value, this.options.cache.residency_status),
      });
    };
    this.controls.reset();
  }

  get disabled (): boolean {
    return !!(
      this.pageState?.isLoading ||
      this.pageState?.errorMessage ||
      this.transaction.state.isProcessing
    );
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
              :options="options.cache.gender ?? []"
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
              :disabled="disabled"
              :value="[ controls.getValue('residency_status')?.[0] ]"
              :options="options.cache.residency_status ?? []"
              @change="controls.update('residency_status', [ $event?.[0] ])"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
            <TextInput
              v-if="controls.getValue('residency_status')?.[0]?.value === '_other'"
              :disabled="disabled"
              style="margin-top: 2px;"
              :value="controls.getValue('residency_status')?.[1]"
              @change="controls.update('residency_status', value => ([ value?.[0], $event ]))"
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
              :options="options.cache.nationalities ?? []"
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
              :options="options.cache.languages ?? []"
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
              :options="options.cache.languages ?? []"
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
              :options="options.cache.outside_school_terms ?? []"
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
              :options="options.cache.enrolment_reasons ?? []"
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
              :options="options.cache.disabilities ?? []"
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
              <t value="person.label.birthplace_address" />
            </label>
            <LocationInput
              :disabled="disabled"
              :value="controls.getValue('birthplace_address')"
              :system="$ema.currentCountry?.locations?.address"
              @change="controls.update('birthplace_address', $event)"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.address" />
            </label>
            <LocationInput
              :disabled="disabled"
              :value="controls.getValue('address')"
              :system="$ema.currentCountry?.locations?.address"
              @change="controls.update('address', $event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>
              <t value="person.label.school_distance_min" />
            </label>
            {{ controls.getValue('school_distance_min') }}
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
              :options="options.cache.distance_to_school ?? []"
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
              :value="[ controls.getValue('school_transport')?.[0] ]"
              :options="options.cache.school_transport ?? []"
              @change="controls.update('school_transport', [ $event?.[0] ])"
            >
              <template #option-content="{ option, selected }">
                <input type="radio" :checked="selected" class="mr-1">
                <t :value="option.item" />
              </template>
            </OptionsSelect>
            <TextInput
              v-if="controls.getValue('school_transport')?.[0]?.value === '_other'"
              :disabled="disabled"
              style="margin-top: 2px;"
              :value="controls.getValue('school_transport')?.[1]"
              @change="controls.update('school_transport', value => ([ value?.[0], $event ]))"
            />
          </div>
        </div>
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
              :options="options.cache.teaching_qualifications ?? []"
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
