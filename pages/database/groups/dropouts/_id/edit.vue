<script lang="ts">
import { Component } from 'vue-property-decorator';
import EditPage3 from '~/components/database/pages/edit/EditPage3.vue';
import app from '~/lib/app';
import { group } from '~/lib/records';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import DropoutEdit from '~/components/views/group/dropout/DropoutEdit.vue';
import controls from '~/components/controls';

@Component({
  components: { DropoutEdit, CountryDBPage, EditPage3 },
})
export default class Edit extends CountryDBPage.ComponentBase {
  entity = group.dropout.entity;
  reducer = group.dropout.parseRecord;
  controls = app.createRef<controls.Group>();

  get transaction () {
    return new app.Transaction(
      () => this.onSubmit(),
      () => this.onCancel(),
    );
  }

  async onSubmit () {
    console.log(this.controls?.ref?.state.params);
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
    >
      <DropoutEdit
        v-model="controls.ref"
        :record-loader="loader"
        :transaction="transaction"
      />
    </EditPage3>
  </CountryDBPage>
</template>
