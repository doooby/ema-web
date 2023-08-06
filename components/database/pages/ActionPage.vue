<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';

@Component({
  components: { LoadedPage },
})
export default class ActionPage extends Vue {
  @Prop({ default: true }) readonly isLoaded!: boolean;

  isConnected = false;

  mounted () {
    if (this.actionData) {
      this.$emit('connect', this.actionData);
    }
    this.isConnected = true;
  }

  get actionData (): unknown {
    return this.$store.state.action.data;
  }
}
</script>

<template>
  <LoadedPage :class="$attrs.class">
    <div
      v-if="!isConnected || !isLoaded"
      class="d-flex h-100 justify-content-center align-items-center"
    >
      <div class="card" style="max-width: 400px;">
        <div class="card-body d-flex flex-column align-items-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="mt-3">
            <t value="app.action_page.loading" />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!actionData">
      <div class="container pt-4 pb-5">
        <b-alert show variant="warning">
          <b-icon icon="exclamation-triangle-fill" class="mr-3" />
          <t value="app.action_page.missing_data" />
          <div class="text-muted font-12 mt-2">
            <t value="app.action_page.missing_data_note" />
          </div>
        </b-alert>
      </div>
    </div>
    <slot v-else />
  </LoadedPage>
</template>
