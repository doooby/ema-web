<template>
  <span :class="$attrs.class">
    {{ translatedText }}
    <b-icon-chat-left-quote
      v-if="debugTranslations"
      v-b-popover.hover.left="value"
    />
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Boolean extends Vue {
  @Prop({ required: true }) value!: string;

  get translatedText (): string {
    return this.$t(this.value);
  }

  get debugTranslations (): boolean {
    const { currentUser, debugTranslations } = this.$store.state.session;
    return currentUser && debugTranslations;
  }
}
</script>
