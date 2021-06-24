<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-lg-10">
          <h2>{{ $t('record.schools.meta.s') }}</h2>
          <b-alert :show="!record && !loadingFailed" variant="info">
            {{ $t('db.meta.loading') }}
          </b-alert>
          <b-alert :show="loadingFailed" variant="warning">
            {{ $t('db.meta.record_not_found') }}
          </b-alert>
          <div v-if="record">
            <h3>{{ record.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'database',
  data () {
    return {
      record: null as any,
      loading: this.$api.createRequestState(),
      loadingFailed: false,
    };
  },
  async mounted () {
    const id = this.$route.params.id;
    const requestGet = this.$api.queries.schools.get;
    const result = await this.$api.query(this.loading, requestGet, id);
    if (result?.success) {
      this.record = result.record;
    } else {
      this.loadingFailed = true;
    }
  },
});
</script>
