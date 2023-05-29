<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ConfirmArchiveModal from '~/components/database/modals/ConfirmArchiveModal.vue';

@Component({
  components: {
    ConfirmArchiveModal,
    ShowPageAction,
  },
})
export default class ArchiveAction extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: any;

  modalShown = false
}
</script>

<template>
  <li>
    <show-page-action
      icon="lock"
      @click="modalShown = true"
    >
      <t value="db.components.modals.ConfirmArchiveModal.action" />
    </show-page-action>
    <ConfirmArchiveModal
      v-model="modalShown"
      :entity="entity"
      :record-id="record.id"
      @recordChanged="$emit('archived')"
    />
  </li>
</template>
