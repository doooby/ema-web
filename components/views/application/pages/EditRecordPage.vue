<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ActionPage2 from '~/components/database/pages/ActionPage2.vue';
import RecordEditCard from '~/components/views/application/RecordEditCard/RecordEditCard.vue';
import app from '~/lib/app';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { ErrorMessage } from '~/lib/api2';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';

// TODO depricated

@Component({
  components: {
    EntityCardHeader,
    RecordErrors,
    RecordEditCard,
    ActionPage2,
  },
})
export default class EditRecordPage extends Vue {
  @Prop({ required: true }) readonly title!: string;
  @Prop({ required: true }) readonly active!: boolean;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly saveErrors: app.Maybe<{
    entity: string;
    messages: ErrorMessage[];
  }>;
}
</script>

<template>
  <ActionPage2
    :is-connected="active"
    @connect="$emit('connect', $event)"
  >
    <RecordEditCard
      :active="active"
      :is-processing="transaction.state.isProcessing"
      @save="transaction.commit"
      @cancel="transaction.cancel"
    >
      <template #header>
        <EntityCardHeader>
          <t :value="title" />
        </EntityCardHeader>
      </template>
      <template v-if="saveErrors" #errors>
        <RecordErrors
          :entity="saveErrors.entity"
          :errors="saveErrors.messages"
        />
      </template>
      <slot />
    </RecordEditCard>
  </ActionPage2>
</template>
