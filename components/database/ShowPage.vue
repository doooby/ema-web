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
          <slot name="actions" :record="record" :reloadRecord="reloadRecord" />
        </div>
        <div class="col emb-6">
          <slot name="details" :record="record" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RecordGet } from '~/lib/api/mappers';

@Component
export default class ShowPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;

  getQueryState = this.$api.newQueryState<RecordGet>();
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
    const recordGet = this.getQueryState.value;
    return recordGet ? !recordGet.success : false;
  }

  get record (): null | any {
    const recordGet = this.getQueryState.value;
    return recordGet?.success ? recordGet.record : null;
  }

  updatePage () {
    this.getQueryState.reset();
    this.fetchRecord();
  }

  async fetchRecord () {
    const entityQueries = (this.$api.queries as any)[this.entity];
    const queryBuilder = entityQueries?.get || entityQueries?.show;
    if (!queryBuilder) {
      utils.warn('database.ShowPage: get/show query is missing.', { entity: this.entity });
      return;
    }

    await this.$api.request(queryBuilder(this.recordId), this.getQueryState);
    if (this.record) {
      this.$emit('load', this.record);
    }
  }
}
</script>
