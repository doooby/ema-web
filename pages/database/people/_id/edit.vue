<template>
  <edit-page
    entity="people"
    :fields="fields"
    :value="values"
    card-class="col-md-12 col-lg-8"
    @change="onChange"
    @update="onUpdated"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-md-6">
          <form-field name="first_name" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="last_name" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="born_on" :context="context" :values="values" />
          <form-field name="gender" :context="context" :values="values" />
          <form-field name="citizen_id" :context="context" :values="values" />
          <form-field name="passport_no" :context="context" :values="values" />
          <form-field name="telephone_no" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="mother_tongue" :context="context" :values="values" />
          <form-field name="spoken_languages" :context="context" :values="values" />
          <form-field name="registered_on" :context="context" :values="values" />
          <form-field name="enrollment_reason" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="disability" :context="context" :values="values" />
        </div>
        <div class="col-md-6" />
        <div v-if="values.disability && values.disability[0]" class="col-md-6">
          <form-field name="disability_diagnosis" :context="context" :values="values" />
          <form-field name="assistance_needed" :context="context" :values="values" />
          <form-field name="assistance_provided" :context="context" :values="values" />
        </div>
        <div v-if="values.disability && values.disability[0]" class="col-md-6">
          <form-field name="disability_note" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="residency_status" :context="context" :values="values" />
          <form-field name="school_transport" :context="context" :values="values" />
          <form-field name="school_distance_km" :context="context" :values="values" />
          <form-field name="school_distance_min" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          address
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-12">
          <form-field name="caregivers" :context="context" :values="values" />
        </div>
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { person } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  values = {} as any;

  get fields (): FormFieldDefinition[] {
    return person.editControls();
  }

  onChange (newValues) {
    // const oldValues = this.values;
    if (!newValues.disability?.length) {
      newValues = {
        ...newValues,
        disability_diagnosis: undefined,
        assistance_needed: undefined,
        assistance_provided: undefined,
        disability_note: undefined,
      };
    }
    this.values = newValues;
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/people/${record.id}` });
  }
}
</script>
