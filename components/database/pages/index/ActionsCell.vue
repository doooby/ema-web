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
  <div class="d-flex">
    <b-form-checkbox
      class="ml-2"
      :checked="selected"
      @change="$emit('change')"
    />
    <record-actions
      :entity="entity"
      :record="record"
      :actions="actions"
    />
  </div>
</template>
