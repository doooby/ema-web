<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EntityIndexLink from '~/components/database/pages/shared/EntityIndexLink.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordLoader from '~/components/database/pages/loaders/RecordLoader.vue';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import RecordEditCard from '~/components/views/application/RecordEditCard/RecordEditCard.vue';

@Component({
  components: { RecordEditCard, RecordErrors, LoadingBlock, RecordLoader, EntityCardHeader, EntityIndexLink },
})
export default class EditPage3 extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly recordResource!: app.Nullable<app.api.Resource<wai.ResourceShow>>;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly saveErrors?: wai.ResourceError[];
  @Prop() readonly hasIndexPage?: boolean;
  @Prop() readonly hasShowPage?: boolean;

  get record () {
    return this.recordResource?.state.resource;
  }
}
</script>

<template>
  <div class="container pt-4 pb-5">

    <h4
      v-if="hasIndexPage"
      class="mb-3"
    >
      <EntityIndexLink :entity="entity" />
    </h4>

    <RecordEditCard
      :is-loading="!recordResource || recordResource.state.isLoading"
      :is-processing="transaction.state.isProcessing"
      @save="transaction.commit"
      @cancel="transaction.cancel"
    >
      <template #header>
        <EntityCardHeader
          :record="record"
          :entity="entity"
          :has-show-page="hasShowPage"
        />
      </template>
      <template v-if="saveErrors" #errors>
        <RecordErrors :entity="entity" :errors="saveErrors" />
      </template>
      <slot />
    </RecordEditCard>
  </div>
</template>
