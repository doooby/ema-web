<template>
  <b-modal
    :visible="value"
    :title="$t('db.pages.change_pass')"
    @show="onShow"
    @hidden="onHidden"
    @ok="onSubmit"
  >
    <b-form-group
      label="password"
      label-for="password-new"
    >
      <b-form-input
        id="password-new"
        v-model="form.password"
        type="password"
      />
    </b-form-group>
    <b-alert :show="form.error !== null" variant="danger" class="emt-4">
      {{ form.error }}
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: { type: Boolean, required: true },
    record: { type: Object as any, required: true },
  },
  data () {
    return {
      form: {
        password: '',
        error: null as null | string,
      },
    };
  },
  methods: {
    onShow () {
      this.form.password = '';
      this.form.error = null;
    },
    onHidden () {
      this.$emit('input', false);
    },
    async onSubmit (event: any) {
      event.preventDefault();

      const { password } = this.form;
      const result = await this.$api.request(
        this.$api.queries.users.changePassword(this.record.id, password),
        this.$api.newQueryState(),
      );
      console.log(result);
      if (result?.success) {
        this.onHidden();
      } else {
        this.form.error = result?.errors?.[0] || [ 'base', 'unknown' ];
      }
    },
  },
});
</script>
