<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoadedPage extends Vue {
  get isLoaded (): boolean {
    return !!this.$store.state.session.countryData;
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <slot v-if="isLoaded" />
  </div>
</template>
