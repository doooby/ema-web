<template>
  <b-modal
    :visible="value"
    :title="$t(`db.pages.users.${record.lock ? 'un' : ''}lock`)"
    @show="onShow"
    @hidden="onHidden"
    @ok="onSubmit"
  >
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

      await this.$api.request(
        this.$api.queries.users.lock(this.record.id, {
          lock: !this.record.lock,
          wipe_password: this.form.wipePassword,
        }),
        this.$api.newQueryState(),
      );

      this.onHidden();
      this.$emit('recordChanged');
    },
  },
});
</script>
