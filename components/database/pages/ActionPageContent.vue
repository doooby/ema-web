<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ActionPageContent extends Vue {
  @Prop() readonly present?: boolean;
}
</script>

<template>
  <div class="container pt-4 mb-5">
    <div v-if="!present">
      <b-alert show variant="warning">
        <b-icon icon="exclamation-triangle-fill" class="mr-3" />
        <t value="app.action_page.missing_data" />
        <div class="text-muted font-12 mt-2">
          <t value="app.action_page.missing_data_note" />
        </div>
      </b-alert>
    </div>
    <slot v-else />
  </div>
</template>
