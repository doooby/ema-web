<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';

@Component({
  components: { RequestButton },
})
export default class EditRecordCard extends Vue {
  @Prop() readonly active?: boolean;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly noBody?: boolean;
}
</script>

<template>
  <div class="card">
    <div v-if="$scopedSlots.header" class="card-header">
      <slot name="header" />
    </div>
    <div v-if="!noBody" class="card-body">
      <slot />
    </div>
    <div class="card-footer">
      <div>
        <RequestButton
          class="btn-success"
          :active="active"
          :processing="transaction.state.isProcessing"
          @click="transaction.commit"
        />
        <b-button
          variant="outline-secondary"
          :disabled="transaction.state.isProcessing"
          @click="transaction.cancel"
        >
          <t value="lexicon.to_cancel" />
        </b-button>
      </div>
      <div
        v-if="$scopedSlots.errors"
        class="mt-3"
      >
        <slot name="errors" />
      </div>
    </div>
  </div>
</template>
