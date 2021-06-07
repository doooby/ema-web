<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          title="new country"
          :fields="fields"
          :create-record="createCountry"
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

export default Vue.extend({
  components: {
    CreateRecordForm,
  },
  layout: 'database',
  data () {
    return {
      fields: defineFormFields(
        { name: 'name', controlType: 'text' },
      ),
      createCountry: this.$api.queries.countries.create,
    };
  },
});
</script>
