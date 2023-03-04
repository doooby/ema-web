<template>
  <div class="page-content">
    <b-alert :show="!record && getQueryState.running" variant="info" class="m-2">
      <t value="app.loading" />
    </b-alert>
    <b-alert :show="recordLoadFailed" variant="warning" class="m-2">
      <t value="app.record_not_found" />
    </b-alert>

    <div v-if="record" class="container">
      <div class="emt-6 emb-6">
        <h2 class="text-center text-secondary">
          <t :value="`db.record.${entity}.meta.s`" />
        </h2>
        <h3 class="d-flex align-items-center">
          <slot name="title" :record="record" />
        </h3>
      </div>
      <div class="row">
        <div class="col-md-4 col-lg-3 overflow-hidden">
          <slot name="actions" :record="record" :reload-record="reloadRecord" />
        </div>
        <div class="col emb-6">
          <slot name="details" :record="record" :reload-record="reloadRecord" />
        </div>
      </div>
      <slot name="container" :record="record" :reload-record="reloadRecord" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { SearchRecordsResponsePayload } from '~/lib/api2';

@Component
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

  get recordLoadFailed (): boolean {
    const response = this.getQueryState.response;
    return !!(response && (!response.ok || response.payload.total < 1));
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
