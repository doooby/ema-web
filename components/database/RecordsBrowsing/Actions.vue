<template>
  <div class="d-flex">
    <b-button
      v-for="(action, i) in actions"
      :key="i"
      class="emr-3 emb-3"
      :variant="action.variant"
      @click="action.onClick"
    >
      <b-icon :icon="action.icon" class="emr-2" />
      <t :value="action.text" />
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface Action {
  variant: string;
  text: string;
  icon: string;
  onClick(): void;
}

@Component
export default class Actions extends Vue {
  @Prop({ required: true }) readonly actions!: Action[];
}
</script>
