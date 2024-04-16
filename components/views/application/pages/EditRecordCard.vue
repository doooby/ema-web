<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';
import TransactionControls from '~/components/views/application/db/TransactionControls.vue';
import LoaderStrip from '~/components/views/application/pages/LoaderStrip.vue';

// TODO rename active to disabled
// TODO use active from pageState only
@Component({
  components: { LoaderStrip, TransactionControls, RequestButton },
})
export default class EditRecordCard extends Vue {
  @Prop() readonly pageState?: app.page.State;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly active?: boolean;
  @Prop() readonly noBody?: boolean;

  get isProcessing (): boolean {
    return !!(this.pageState?.isLoading && !this.pageState.errorMessage);
  }

  get activeInternal (): boolean {
    if (!this.pageState) return !!this.active;
    return !this.pageState.isLoading &&
     !this.pageState.errorMessage &&
     !this.transaction.state.isProcessing;
  }
}
</script>

<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body p-0">
      <LoaderStrip :is-processing="isProcessing" />
      <div v-if="pageState?.errorMessage" class="m-0 alert alert-warning">
        <t
          class="d-block"
          value="views.application.RecordsTable.fetch_fail"
        />
        <t
          class="d-block"
          :value="pageState.errorMessage"
        />
      </div>
    </div>
    <div v-if="!noBody" class="card-body">
      <slot />
    </div>
    <TransactionControls
      class="card-body"
      :active="activeInternal"
      :transaction="transaction"
    >
      <template v-if="$slots.errors" #errors>
        <slot name="errors" />
      </template>
    </TransactionControls>
  </div>
</template>
