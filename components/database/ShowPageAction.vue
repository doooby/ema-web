<template>
  <b-button
    :class="[
      $attrs.class,
      'd-flex align-items-center',
    ]"
    variant="link"
    @click="onClick"
  >
    <b-icon :icon="icon" class="emr-4" />
    <b-icon v-if="!path" icon="back" class="font-12 opacity-70 emr-2" />
    <slot />
  </b-button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BrowsePageAction extends Vue {
  @Prop({ default: null }) readonly path!: null | string;
  @Prop({ default: false }) readonly modal!: boolean | string;
  @Prop({ required: true }) readonly icon!: string;

  onClick (event: any): void {
    if (this.path) {
      this.$router.push({ path: this.path });
    } else {
      this.$emit('click', event);
    }
  }
}
</script>
