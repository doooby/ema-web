<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import RecordActions, { Action } from '~/components/database/cells/RecordActions.vue';

@Component({
  components: {
    RecordActions,
  },
})
export default class ActionsCell extends Vue {
  @Prop({ required: true }) readonly selected!: boolean;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly actions!: Action[];
}
</script>

<template>
  <div class="d-flex flex-column h-100">
    <div>
      <b-button
        variant="outline-secondary"
        size="xs"
        @click="$emit('change')"
      >
        <b-icon v-if="selected" icon="check" />
        <div v-else class="--empty" />
      </b-button>
    </div>
    <record-actions
      class="mt-2"
      :entity="entity"
      :record="record"
      :actions="actions"
    />
  </div>
</template>

<style>
.--empty {
  width: 1rem;
  height: 1rem;
}
</style>
