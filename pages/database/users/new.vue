<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          title="new user"
          :fields="fields"
          :create-record="createUser"
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
        { name: 'login', controlType: 'text' },
        { name: 'full_name', controlType: 'text' },
      ),
      createUser: this.$api.queries.users.create,
    };
  },
});
</script>
