<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordLoader from '~/components/database/pages/loaders/RecordLoader.vue';

@Component({
  components: { RecordLoader },
})
export default class ShowPage3 extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop() readonly slices?: string[];

  get sanitizedSlices (): string[] {
    if (!this.slices) return [ 'record' ];
    return this.slices;
  }
}
</script>

<template>
  <RecordLoader
    v-slot="{ loader }"
    :entity="entity"
    id-from-params="id"
    :slices="sanitizedSlices"
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
