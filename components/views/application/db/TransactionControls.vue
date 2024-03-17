<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';
import app from '~/lib/app';

// TODO rename active to disabled
@Component({
  components: { RequestButton },
})
export default class TransactionControls extends Vue {
  @Prop() readonly active?: boolean;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
}
</script>

<template>
  <div :class="$attrs.class">
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
    <div v-if="$slots.errors" class="mt-3">
      <slot name="errors" />
    </div>
  </div>
</template>
