<template>
  <show-page
    entity="groups"
    :record-id="recordId"
  >
    <template #detail="{ record }">
      year: {{ record.year }}
      <br>

      school:
      <show-record-link entity="schools" :record-id="record.school.id">
        {{ record.school.name }}
      </show-record-link>
      <br>

      course:
      <show-record-link entity="courses" :record-id="record.course.id">
        {{ record.course.name }}
      </show-record-link>
      <br>

      <b-tabs lazy class="emy-3" content-class="emt-3">
        <b-tab :title="$t('record.groups.students')">
          <div class="d-flex flex-row-reverse">
            <div>
              <nuxt-link
                :to="`/database/groups/${recordId}/edit_students`"
                :title="$t('db.pages.edit_students')"
              >
                <b-icon-pencil variant="secondary" />
              </nuxt-link>
            </div>
          </div>
          <StudentsListing :group="record" />
        </b-tab>
      </b-tabs>
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import StudentsListing from '~/components/database/pages/groups/StudentsListing.vue';
import { BIconPencil } from 'bootstrap-vue';

export default Vue.extend({
  components: { ShowPage, ShowRecordLink, StudentsListing, BIconPencil },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
    };
  },
});
</script>
