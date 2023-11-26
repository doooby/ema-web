<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage3 from '~/components/database/pages/edit/EditPage3.vue';
import app from '~/lib/app';
import { group } from '~/lib/records';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import DropoutEdit from '~/components/views/group/dropout/DropoutEdit.vue';
import controls from '~/components/controls';
import { wai } from '~/vendor/wai';

@Component({
  components: { DropoutEdit, CountryDBPage, EditPage3 },
})
export default class Edit extends CountryDBPage.ComponentBase {
  entity = group.dropout.entity;
  reducer = group.dropout.parseRecord;
  controls = app.createRef<controls.Group>();
  saveErrors = app.createRef<wai.ResourceError[]>();
  recordId = '';

  get transaction () {
    return new app.Transaction(
      () => this.onSubmit(),
      () => this.onCancel(),
    );
  }

  async onSubmit () {
    if (!this.recordId) return;
    const params = this.controls?.ref?.getParams();

    const result = await this.$api2.V3_request({
      path: `/groups/dropouts/${this.recordId}/update`,
      params: {
        record: params,
      },
      reducer: wai.recordUpdate,
    });

    const success = app.api.updateSuccess(result.response);
    const errors = app.api.updateErrors(result.response);
    if (success && !errors?.length) {
      window.location.reload();
    } else {
      this.saveErrors.ref = errors ?? [
        [ undefined, 'failed' ],
      ];
    }
  }

  onCancel () {
    this.$router.go(-1);
  }
}
</script>

<template>
  <CountryDBPage>
    <EditPage3
      v-slot="{ loader }"
      :entity="entity"
      :slices="[ 'record', 'group' ]"
      :reducer="reducer"
      :transaction="transaction"
      :errors="saveErrors.ref"
      @load="recordId = $event.id"
    >
      <DropoutEdit
        v-model="controls.ref"
        :record-loader="loader"
        :transaction="transaction"
      />
    </EditPage3>
  </CountryDBPage>
</template>
