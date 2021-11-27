<template>
  <span :class="$attrs.class">
    {{ translatedText }}
    <b-icon
      v-if="debugTranslations"
      v-b-popover.hover.left="value"
      icon="chat-left-quote"
      class="d-inline-block"
      @click.capture.prevent="onCopy"
    />
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Translation extends Vue {
  @Prop({ required: true }) value!: string;

  get translatedText (): string {
    return this.$t(this.value) as string;
  }

  get debugTranslations (): boolean {
    const { currentUser, debugTranslations } = this.$store.state.session;
    return currentUser && debugTranslations;
  }

  onCopy (): void {
    navigator.clipboard.writeText(this.value);
  }
}
</script>
