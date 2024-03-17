<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';
import TransactionControls from '~/components/views/application/db/TransactionControls.vue';

// TODO rename active to disabled
@Component({
  components: { TransactionControls, RequestButton },
})
export default class EditRecordCard extends Vue {
  @Prop() readonly active?: boolean;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly noBody?: boolean;
}
</script>

<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div v-if="!noBody" class="card-body">
      <slot />
    </div>
    <TransactionControls
      class="card-footer"
      :active="active"
      :transaction="transaction"
    >
      <template v-if="$slots.errors" #errors>
        <slot name="errors" />
      </template>
    </TransactionControls>
  </div>
</template>
