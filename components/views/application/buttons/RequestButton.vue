<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';

// TODO rename active to disabled
@Component
export default class RequestButton extends Vue {
  @Prop() readonly processing?: boolean;
  @Prop() readonly active?: boolean;
  @Prop() readonly text?: string;

  delayedProcessing = false;
  t_delayedProcessing = app.nullable<any>();

  @Watch('processing')
  onProcessingChange (newValue) {
    if (this.t_delayedProcessing) {
      clearTimeout(this.t_delayedProcessing);
      this.t_delayedProcessing = null;
    }

    if (newValue) this.delayedProcessing = true;
    else {
      this.t_delayedProcessing = setTimeout(
        () => {
          this.delayedProcessing = false;
          this.t_delayedProcessing = null;
        },
        400,
      );
    }
  }
}
</script>

<template>
  <button
    :class="[
      'btn position-relative',
      $attrs.class,
    ]"
    type="button"
    :disabled="!active || delayedProcessing"
    @click="$emit('click')"
  >
    <t :value="text ?? 'app.action.save'" />
    <transition name="fade-in">
      <div
        v-if="delayedProcessing"
        class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
        :style="{ top: 0, left: 0 }"
      >
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="sr-only" />
        </div>
      </div>
    </transition>
  </button>
</template>

<style scoped>
.fade-in-enter, .fade-in-leave-to {
  opacity: 0;
}
.fade-in-enter-active {
  transition: opacity 0.25s;
}
</style>
