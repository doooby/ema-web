<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import SaveButton from '~/components/toolkit/SaveButton.vue';

@Component({
  components: {
    SaveButton,
    RecordErrors,
    LoadingBlock,
  },
})
export default class RecordEditCard extends Vue {
  @Prop() readonly isLoading!: boolean;
  @Prop() readonly isProcessing!: boolean;
}
</script>

<template>
  <div class="card">
    <div v-if="$scopedSlots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <LoadingBlock :is-loading="isLoading" />
      <slot />
    </div>
    <div class="card-footer">
      <div>
        <SaveButton
          :active="!isLoading"
          :processing="isProcessing"
          @click="$emit('save')"
        />
        <b-button
          variant="outline-secondary"
          :disabled="isProcessing"
          @click="$emit('cancel')"
        >
          <t value="app.action.cancel" />
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
