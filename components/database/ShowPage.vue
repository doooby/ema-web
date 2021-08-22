<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-lg-10">
          <h2 class="text-center">
            {{ $t(`record.${entity}.meta.s`) }}
          </h2>
          <b-alert :show="!record && !getQueryState.error" variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
          <b-alert :show="getQueryState.error" variant="warning">
            {{ $t('db.shared.record_not_found') }}
          </b-alert>
          <h3 v-if="record" class="d-flex align-items-center emb-6">
            {{ title.text(record) }}
            <edit-record-link
              v-if="title.showEditLink"
              :entity="entity"
              :record-id="recordId"
              class="btn btn-outline-secondary btn-sm eml-4"
            />
          </h3>
          <slot
            v-if="record"
            name="detail"
            :record="record"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { notify } from '~/lib/notifier';
import EditRecordLink from '~/components/database/EditRecordLink.vue';

interface Title {
  text(record: any): undefined | string;
  showEditLink?: boolean;
}

const title_text_default = (record: any) => record.name as string;
export function buildTitle (props: Partial<Title>): Title {
  return Object.freeze({
    text: title_text_default,
    ...props,
  });
}

export default Vue.extend({
  components: { EditRecordLink },
  props: {
    entity: { type: String, required: true },
    recordId: { type: Number, required: true },
    title: {
      type: Object as PropType<Title>,
      default: () => buildTitle({ showEditLink: true }),
    },
  },
  data () {
    return {
      getQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    record (): null | any {
      return this.getQueryState.value?.record;
    },
  },
  mounted () {
    this.getQuery();
  },
  methods: {
    async getQuery () {
      const queryBuilder = (this.$api.queries as any)[this.entity]?.get;
      if (!queryBuilder) {
        notify('error', 'database.ShowPage: get query is missing.', { entity: this.entity });
        return;
      }

      await this.$api.request(queryBuilder(this.recordId), this.getQueryState);
      if (this.record) {
        this.$emit('load', this.record);
      }
    },
  },
});
</script>
