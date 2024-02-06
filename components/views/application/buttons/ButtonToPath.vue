<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ButtonToPath extends Vue {
  @Prop({ required: true }) path!: string;
}
</script>

<template>
  <nuxt-link
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    :to="path"
  >
    <slot />
  </nuxt-link>
</template>
