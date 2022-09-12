<template>
  <edit-page
    entity="people"
    :fields="fields"
    card-class="col-md-12 col-lg-8"
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
          <form-field name="passport_no" :context="context" :values="values" />
          <form-field name="telephone_no" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="mother_tongue" :context="context" :values="values" />
          <form-field name="spoken_languages" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="disability" :context="context" :values="values" />
        </div>
        <div class="col-md-6" />
        <div class="col-md-6">
          <form-field name="disability_diagnosis" :context="context" :values="values" />
          <form-field name="assistance_needed" :context="context" :values="values" />
          <form-field name="assistance_provided" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="disability_note" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="residency_status" :context="context" :values="values" />
          <form-field name="school_distance_km" :context="context" :values="values" />
          <form-field name="school_distance_min" :context="context" :values="values" />
          <form-field name="school_transport" :context="context" :values="values" />
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
  get fields (): FormFieldDefinition[] {
    return person.editControls();
  }

  onUpdated (record: any) {
    this.$router.push({ path: `/database/people/${record.id}` });
  }
}
</script>
