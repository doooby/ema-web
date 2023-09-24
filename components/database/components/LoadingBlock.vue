<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class LoadingBlock extends Vue {
  @Prop() readonly isLoading!: boolean;
  @Prop() readonly failMessage!: string;
}
</script>

<template>
  <div :class="$attrs.class">
    <div
      v-if="isLoading"
      class="spinner-border"
      role="status"
    >
      <span class="sr-only" />
    </div>
    <div v-else-if="failMessage">
      <b-alert show variant="warning">
        <b-icon icon="exclamation-triangle-fill" class="mr-3" />
        <t :value="failMessage" />
        <div v-if="$slots['fail-content']">
          <slot name="fail-content" />
        </div>
      </b-alert>
    </div>
    <slot v-else />
  </div>
</template>
