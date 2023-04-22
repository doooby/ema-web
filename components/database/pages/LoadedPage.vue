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
    <div
      v-if="!isLoaded"
      class="d-flex h-100 justify-content-center align-items-center"
    >
      <div class="card" style="max-width: 400px;">
        <div class="card-body d-flex flex-column align-items-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="mt-3">
            <t value="app.loading_country" />
          </div>
        </div>
      </div>
    </div>
    <slot v-else />
  </div>
</template>
