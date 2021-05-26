<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          title="new country"
          :fields="fields"
          :api-request="createCountry"
          on-success-route="/database"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineFormFields } from '@c/Form';
import CreateRecordForm from '@c/database/CreateRecordForm.vue';
import { create as createCountry } from '~/lib/api/countries';

export default Vue.extend({
  components: {
    CreateRecordForm,
  },
  layout: 'database',
  data () {
    return {
      fields: defineFormFields(
        { name: 'designation', controlType: 'text' },
      ),
      createCountry,
    };
  },
});
</script>
