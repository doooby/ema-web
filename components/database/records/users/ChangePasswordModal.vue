<template>
  <b-modal
    :visible="value"
    @show="onShow"
    @hidden="onHidden"
    @ok="onSubmit"
  >
    <template #modal-title>
      <t value="db.record.users.change_pass" />
    </template>
    <b-form-group
      v-if="value"
      label="password"
      label-for="password-new"
    >
      <b-form-input
        id="password-new"
        v-model="form.password"
        type="password"
      />
    </b-form-group>
    <b-alert
      v-if="form.error !== null"
      show
      variant="danger"
      class="emt-4"
    >
      {{ form.error }}
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { UpdatedRecordResponsePayload } from '~/lib/api2';

export default Vue.extend({
  props: {
    value: { type: Boolean, required: true },
    record: { type: Object as Vue.PropType<any>, required: true },
  },
  data () {
    return {
      form: {
        password: '',
        error: null as null | [ string, string ],
      },
      request: this.$api2.newQueryState<UpdatedRecordResponsePayload>(),
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
      if (this.request.processing) return;

      const { password } = this.form;
      await this.$api2.request(
        this.request,
        this.$api2.getQuery('users', 'changePassword')(this.record.id, password),
      );

      const payload = this.$api2.mapPayload(this.request);
      if (payload?.record_id) {
        this.onHidden();
      } else {
        this.form.error = (payload && payload.record_id === undefined && payload.errors[0]) || [ 'base', 'unknown' ];
      }
    },
  },
});
</script>
