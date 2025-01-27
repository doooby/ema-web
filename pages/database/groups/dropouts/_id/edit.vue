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
  dropoutResource = app.nullable<app.api.Resource<wai.ResourceShow<group.dropout.Dropout>>>();

  entity = group.dropout.entity;
  controls = app.createRef<controls.Group>();
  saveErrors = app.nullable<wai.ResourceError[]>();

  created () {
    this.dropoutResource = app.api.Resource.loadRecord(this, {
      path: `/v3/${this.entity}`,
      reducer: group.dropout.parseRecord,
      params: {
        id: this.$route.params.id,
        slices: [ 'record', 'group' ],
      },
    }).resource;
  }

  get transaction () {
    return new app.Transaction(
      () => this.onSubmit(),
      () => this.$router.go(-1),
    );
  }

  async onSubmit () {
    const dropout = this.dropoutResource?.state.resource?.record;
    if (!dropout) return;
    this.transaction.state.isProcessing = true;
    this.saveErrors = null;
    console.log(dropout);

    const params = this.controls?.ref?.getParams();
    const result = await this.$api2.V3_request({
      path: `/groups/dropouts/${dropout.id}/update`,
      params: {
        record: params,
      },
      reducer: wai.recordUpdate,
    });
    this.saveErrors = app.api.updateErrors(result.response) ?? null;
    if (this.saveErrors) {
      this.transaction.state.isProcessing = false;
      return;
    }

    const path = `/database/groups/${dropout.group?.group.id}`;
    await this.$router.replace({ path });
  }
}
</script>

<template>
  <CountryDBPage>
    <EditPage3
      :entity="entity"
      :record-resource="dropoutResource"
      :transaction="transaction"
      :save-errors="saveErrors ?? undefined"
    >
      <DropoutEdit
        v-model="controls.ref"
        :record-resource="dropoutResource"
        :transaction="transaction"
      />
    </EditPage3>
  </CountryDBPage>
</template>
