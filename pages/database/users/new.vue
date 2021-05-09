<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4">
          <h2>
            Create new User
          </h2>
          <form-view
            v-model="user"
            :fields="fields"
          />
          <div class="text-right">
            <span v-if="saving.running">
              saving...
            </span>
            <b-button
              variant="success"
              :disabled="saving.running"
              @click="save"
            >
              Save
            </b-button>
          </div>
          <b-list-group
            v-if="errors"
            class="mt-3"
          >
            <b-list-group-item
              v-for="([attribute, message], index) in errors"
              :key="index"
              variant="danger"
            >
              <strong>{{ attribute }}</strong>: {{ message }}
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineFormFields, createFormModel } from '@c/Form';
import FormView from '@c/Form/View.vue';
import { RecordErrors } from '~/lib/api/mappers';

export default Vue.extend({
  components: {
    FormView,
  },
  layout: 'database',
  data () {
    return {
      fields: defineFormFields(
        { name: 'login', controlType: 'text' },
        { name: 'full_name', controlType: 'text' },
      ),
      user: createFormModel(),
      errors: null as null | RecordErrors,
      saving: this.$api.createRequestState(),
    };
  },
  methods: {
    save () {
      if (this.saving.running) return;
      this.errors = null;
      this.$api.query(this.saving, async (api) => {
        const result = await api.users.create(this.saving, this.user);
        if (result === null) return;
        if (result.success) {
          this.$router.push({ path: '/database/users' });
        } else if (result.errors) {
          this.errors = result.errors;
        }
      });
    },
  },
});
</script>
