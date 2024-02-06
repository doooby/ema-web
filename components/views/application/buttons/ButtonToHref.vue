<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ButtonToHref extends Vue {
  @Prop({ required: true }) href!: string;
  @Prop() target?: string;
}
</script>

<template>
  <a
    :href="href"
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    :target="target"
  >
    <slot />
  </a>
</template>
