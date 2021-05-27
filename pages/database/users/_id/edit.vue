<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <update-record-form
          class="col-md-8 col-lg-4"
          title="edit user"
          :fields="fields"
          :record-id="recordId"
          :get-record="getUser"
          :update-record="updateUser"
          on-success="/database"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineFormFields } from '@c/Form';
import UpdateRecordForm from '@c/database/UpdateRecordForm.vue';

export default Vue.extend({
  components: {
    UpdateRecordForm,
  },
  layout: 'database',
  data () {
    return {
      fields: defineFormFields(
        { name: 'login', controlType: 'text' },
        { name: 'full_name', controlType: 'text' },
      ),
      getUser: this.$api.queries.users.get,
      updateUser: this.$api.queries.users.update,
    };
  },
  computed: {
    recordId () {
      return this.$route.params.id;
    },
  },
});
</script>
