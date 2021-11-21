<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-lg-10">
          <h2 class="text-center">
            {{ $t(`record.${entity}.meta.s`) }}
          </h2>
          <b-alert :show="!record && !getQueryState.fail" variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
          <b-alert :show="getQueryState.fail" variant="warning">
            {{ $t('db.shared.record_not_found') }}
          </b-alert>
          <h3 v-if="record" class="d-flex align-items-center emb-6">
            <slot name="title" :record="record" />
            <edit-record-link
              :entity="entity"
              :record-id="recordId"
              class="btn btn-outline-secondary btn-sm eml-4"
            />
          </h3>
          <slot
            v-if="record"
            name="detail"
            :record="record"
            :reloadRecord="reloadRecord"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EditRecordLink from '~/components/database/EditRecordLink.vue';

@Component({
  components: { EditRecordLink },
})
export default class ShowPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;

  getQueryState = this.$api.newQueryState();
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
    return this.getQueryState.value?.record;
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
