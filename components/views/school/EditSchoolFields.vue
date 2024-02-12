<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import {
  BRecordsSelect, NameInput, TextInput, OptionsSelect,
  IntegerInput, LocationInput,
} from '~/components/controls/inputs';
import { school } from '~/lib/records';

@Component({
  components: {
    TextInput,
    NameInput,
    IntegerInput,
    BRecordsSelect,
    OptionsSelect,
    LocationInput,
  },
})
export default class EditSchoolFields extends Vue {
  @Prop({ required: true }) saveable!: app.page.SaveablePage;
  @Prop() record?: school.RecordSlice;

  options = new app.internals.Options();

  created () {
    this.saveable.record = {
      name: this.record?.name ?? [ '', '' ],
      education_levels: this.record?.education_levels,
      director: [ this.record?.director ],
      external_id: this.record?.external_id,
      address: this.record?.address,
      education_types: this.options.getByValues(
        this,
        'education_type',
        this.record?.education_types,
      ),
      gender_dedications: this.options.getByValues(
        this,
        'gender',
        this.record?.gender_dedications,
      ),
      classrooms_count: this.record?.classrooms_count,
      female_latrines_count: this.record?.female_latrines_count,
      male_latrines_count: this.record?.male_latrines_count,
    };
    this.saveable.getRecordParams = () => {
      const { record } = this.saveable;
      return {
        name: record.name,
        education_levels_ids: record.education_levels?.map(r => r.id),
        director_id: record.director?.[0]?.id,
        external_id: record.external_id,
        address: record.address,
        education_types: record.education_types?.map(i => i.value),
        gender_dedications: record.gender_dedications?.map(i => i.value),
        classrooms_count: record.classrooms_count,
        female_latrines_count: record.female_latrines_count,
        male_latrines_count: record.male_latrines_count,
      };
    };
  }
}
</script>

<template>
  <div class="row">
    <div class="col-md-6">
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.name" />
        </template>
        <NameInput
          v-model="saveable.record.name"
          @submit="saveable.transaction.commit"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.education_levels" />
        </template>
        <BRecordsSelect
          v-model="saveable.record.education_levels"
          entity="education_levels"
          :record-does-not-have-path="true"
          :multiple="true"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.director" />
        </template>
        <BRecordsSelect
          v-model="saveable.record.director"
          entity="people"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.external_id" />
        </template>
        <TextInput
          v-model="saveable.record.external_id"
          @submit="saveable.transaction.commit"
        />
      </b-form-group>
    </div>
    <div class="col-md-6">
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.address" />
        </template>
        <LocationInput
          v-model="saveable.record.address"
          :system="$ema.currentCountry?.locations?.address"
        />
      </b-form-group>
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.education_types" />
        </template>
        <OptionsSelect
          v-model="saveable.record.education_types"
          :options="options.getAll(this, 'education_type')"
          :multiple="true"
        >
          <template #option-content="{ option }">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.gender_dedications" />
        </template>
        <OptionsSelect
          v-model="saveable.record.gender_dedications"
          :options="options.getAll(this, 'gender')"
          :multiple="true"
        >
          <template #option-content="{ option }">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </b-form-group>
    </div>
    <div class="col-md-6">
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.classrooms_count" />
        </template>
        <IntegerInput
          v-model="saveable.record.classrooms_count"
          @submit="saveable.transaction.commit"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.female_latrines_count" />
        </template>
        <IntegerInput
          v-model="saveable.record.female_latrines_count"
          @submit="saveable.transaction.commit"
        />
      </b-form-group>
      <b-form-group>
        <template #label>
          <t value="db.record.schools.label.male_latrines_count" />
        </template>
        <IntegerInput
          v-model="saveable.record.male_latrines_count"
          @submit="saveable.transaction.commit"
        />
      </b-form-group>
    </div>
  </div>
</template>
