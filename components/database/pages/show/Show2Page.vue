<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SearchRecordsResponsePayload } from '~/lib/api2';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import LoadRecordFail from '~/components/database/components/LoadRecordFail.vue';

@Component({
  components: { LoadRecordFail, ARecordLink, LoadedPage },
})
export default class Show2Page extends Vue {
  @Prop({ required: true }) readonly entity!: string;

  getQueryState = this.$api2.newQueryState<SearchRecordsResponsePayload>();
  reloadRecord = () => this.updatePage();

  @Watch('entity')
  @Watch('recordId')
  onPageChanged () {
    this.updatePage();
  }

  mounted () {
    this.updatePage();
  }

  get recordId () {
    const route = this.$route as any;
    return route.params.id;
  }

  get record (): null | any {
    if (!this.getQueryState.response?.ok) return null;
    return this.getQueryState.response.payload.records[0] ?? null;
  }

  updatePage () {
    this.getQueryState.response = undefined;
    this.getQueryState.processing = false;
    this.fetchRecord();
  }

  async fetchRecord () {
    await this.$api2.request(
      this.getQueryState,
      this.$api2.getQuery(this.entity, 'search')({ id: this.recordId }),
    );
    if (this.record) {
      this.$emit('load', this.record);
    }
  }
}
</script>

<template>
  <loaded-page class="page-content">
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <nuxt-link
          :to="`/database/${entity}`"
        >
          <t :value="`db.record.${entity}.meta.p`" />
        </nuxt-link>
      </h4>

      <div v-if="getQueryState.processing">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <h2 v-if="record && $scopedSlots.title" class="m-0">
        <slot name="title" :record="record" />
      </h2>

      <h5 v-if="!getQueryState.processing && !$scopedSlots.title" class="mt-2">
        <t :value="`db.record.${entity}.meta.s`" />
      </h5>

      <LoadRecordFail :query="getQueryState" />

      <div v-if="record" class="row mt-3">
        <div class="col-md-4 col-lg-3 overflow-hidden">
          <slot name="actions" :record="record" :reload-record="reloadRecord" />
        </div>
        <div class="col emb-6">
          <slot name="details" :record="record" :reload-record="reloadRecord" />
        </div>
      </div>
      <div v-if="record">
        <slot name="container" :record="record" :reload-record="reloadRecord" />
      </div>
    </div>
  </loaded-page>
</template>
