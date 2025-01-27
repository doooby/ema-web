<template>
  <b-modal
    :visible="value"
    @show="onShow"
    @hidden="onHidden"
    @ok="onSubmit"
  >
    <template #modal-title>
      <t :value="`db.record.users.${record.lock ? 'un' : ''}lock`" />
    </template>
    <div v-if="value">
      <div v-if="record.lock">
        <p>
          Unlocking the user enables access to EMA. Are you sure?
          <br>
          ( If password was cleared, you need to set new one. )
        </p>
      </div>
      <div v-else>
        <p>
          Locking the user prevents access to EMA. Are you sure?
        </p>
        <b-form-checkbox
          id="checkbox-1"
          v-model="form.wipePassword"
          name="clear_pass"
        >
          Also clear password
        </b-form-checkbox>
      </div>
    </div>
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
        wipePassword: false,
      },
      request: this.$api2.newQueryState<UpdatedRecordResponsePayload>(),
    };
  },
  methods: {
    onShow () {
      this.form.wipePassword = false;
    },
    onHidden () {
      this.$emit('input', false);
    },
    async onSubmit (event: any) {
      event.preventDefault();
      if (this.request.processing) return;

      await this.$api2.request(
        this.request,
        this.$api2.getQuery('users', 'lock')(this.record.id, {
          lock: !this.record.lock,
          wipe_password: this.form.wipePassword,
        }),
      );

      this.onHidden();
      this.$emit('recordChanged');
    },
  },
});
</script>
