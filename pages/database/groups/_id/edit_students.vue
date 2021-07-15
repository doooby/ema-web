<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-lg-10">
          <h2 class="text-center">
            {{ $t(`db.pages.edit_students`) }}
          </h2>
          <b-alert :show="!group && !loadingFailed" variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
          <b-alert :show="loadingFailed" variant="warning">
            {{ $t('db.shared.record_not_found') }}
          </b-alert>
          <div v-if="group">
            <show-record-link entity="groups" :record-id="group.id">
              {{ group.name }}
            </show-record-link>
            <StudentsListing
              :group="group"
              :editable="true"
              @load-fail="onListingFailedToLoad"
              @loaded="onListingLoaded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Group, Student } from '~/lib/records';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import StudentsListing from '~/components/database/pages/groups/StudentsListing.vue';

export default Vue.extend({
  components: { ShowRecordLink, StudentsListing },
  layout: 'database',
  data () {
    return {
      group: null as null | Group,
      loading: this.$api.createRequestState(),
      loadingFailed: false,
      students: [] as Student[],
    };
  },
  async mounted () {
    if (this.loading.running) return;
    const result = await this.$api.query(
      this.loading,
      this.$api.queries.groups.get,
      Number(this.$route.params.id),
    );
    if (result !== null) {
      this.group = result.record;
    }
  },
  methods: {
    onListingFailedToLoad () {
      this.loadingFailed = true;
    },
    onListingLoaded (students: Student[]) {
      this.students = students;
    },
  },
});
</script>
