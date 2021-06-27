<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-lg-10">
          <h2 class="text-center">
            {{ $t(`record.${entity}.meta.s`) }}
          </h2>
          <b-alert :show="!record && !loadingFailed" variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
          <b-alert :show="loadingFailed" variant="warning">
            {{ $t('db.shared.record_not_found') }}
          </b-alert>
          <h3 v-if="record">
            {{ title.text(record) }}
            <edit-record-link
              v-if="title.showEditLink"
              :entity="entity"
              :record-id="recordId"
            />
          </h3>
          <slot v-if="record" name="detail" :record="record" />
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
      record: null as any,
      loading: this.$api.createRequestState(),
      loadingFailed: false,
    };
  },
  async mounted () {
    const query = (this.$api.queries as any)[this.entity]?.get;
    if (!query) {
      notify('error', `database.BrowsePage: search query is missing for entity ${this.entity}.`);
      return;
    }
    const result: any = await this.$api.query(this.loading, query, this.recordId);
    if (result?.success) {
      this.record = result.record;
    } else {
      this.loadingFailed = true;
    }
  },
});
</script>
