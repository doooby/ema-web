<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class LoaderStrip extends Vue {
    @Prop() isProcessing?: boolean;
}
</script>

<template>
  <div class="position-relative">
    <div
      v-if="isProcessing"
      class="progress position-absolute w-100"
      :style="{
        left: 0,
        top: 0,
        height: '5px',
      }"
    >
      <div
        class="progress-bar progress-bar-striped progress-bar-animated bg-secondary w-100"
        role="progressbar"
      />
    </div>
  </div>
</template>
