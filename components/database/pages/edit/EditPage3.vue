<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EntityIndexLink from '~/components/database/pages/shared/EntityIndexLink.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordLoader from '~/components/database/pages/loaders/RecordLoader.vue';
import CardSaveableFooter from '~/components/database/components/CardSaveableFooter.vue';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: { RecordErrors, LoadingBlock, CardSaveableFooter, RecordLoader, EntityCardHeader, EntityIndexLink },
})
export default class EditPage3 extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly slices!: string[];
  @Prop({ required: true }) readonly reducer!: (record, associations: wai.Associations) => unknown;
  @Prop({ required: true }) readonly transaction!: app.Transaction;
  @Prop() readonly errors?: wai.ResourceError[];
  @Prop() readonly hasIndexPage?: boolean;
  @Prop() readonly hasShowPage?: boolean;
}
</script>

<template>
  <RecordLoader
    v-slot="{ loader }"
    :entity="entity"
    id-from-params="id"
    :slices="slices"
    :reducer="reducer"
    @load="$emit('load', $event)"
  >
    <div class="container pt-4 pb-5">

      <h4
        v-if="hasIndexPage"
        class="mb-3"
      >
        <EntityIndexLink :entity="entity" />
      </h4>

      <div class="card">
        <EntityCardHeader
          v-if="loader.record"
          :record="loader.record"
          :entity="entity"
          :has-show-page="hasShowPage"
        />
        <div class="card-body">
          <LoadingBlock :is-loading="loader.isLoading" />
          <slot :loader="loader" />
        </div>
        <CardSaveableFooter
          v-if="loader.record"
          :disabled="transaction.state.isProcessing"
          @save="transaction.commit"
          @cancel="transaction.cancel"
        >
          <template v-if="errors" #fail-content>
            <RecordErrors entity="groups" :errors="errors" />
          </template>
        </CardSaveableFooter>
      </div>

    </div>
  </RecordLoader>
</template>
