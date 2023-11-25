<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordLoader from '~/components/database/pages/loaders/RecordLoader.vue';
import { wai } from '~/vendor/wai';

@Component({
  components: { RecordLoader },
})
export default class ShowPage3 extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly slices!: string[];
  @Prop({ required: true }) readonly reducer!: (record, associations: wai.Associations) => unknown;
}
</script>

<template>
  <RecordLoader
    v-slot="{ loader }"
    :entity="entity"
    :reducer="reducer"
    id-from-params="id"
    :slices="slices"
  >
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <nuxt-link
          :to="`/database/${entity}`"
        >
          <t :value="`db.record.${entity}.meta.p`" />
        </nuxt-link>
      </h4>

      <b-alert
        v-if="loader.failReason"
        show
        variant="danger"
      >
        <b-icon icon="exclamation-triangle-fill" class="mr-3" />
        <t :value="`api.reason.${loader.failReason}`" />
      </b-alert>

      <slot :loader="loader" />
    </div>
  </RecordLoader>
</template>
