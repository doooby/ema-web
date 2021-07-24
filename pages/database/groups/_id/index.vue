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
        {{ record.school.label }}
      </show-record-link>
      <br>

      course:
      <show-record-link entity="courses" :record-id="record.course.id">
        {{ record.course.label }}
      </show-record-link>
      <br>

      <b-tabs lazy class="emy-3" content-class="emt-3">
        <b-tab :title="$t('record.groups.students')">
          <div class="text-right">
            <nuxt-link
              :to="`/database/groups/${recordId}/edit_students`"
              :title="$t('db.pages.groups.edit_students')"
            >
              <b-icon-pencil variant="secondary" />
            </nuxt-link>
          </div>
          <StudentsListing :group="record" />
        </b-tab>
        <b-tab :title="$t('record.groups.attendance')">
          <div class="text-right">
            <!--<nuxt-link
              :to="`/database/groups/${recordId}/edit_attendance`"
              :title="$t('db.pages.groups.???')"
            >
              <b-icon-pencil variant="secondary" />
            </nuxt-link>-->
          </div>
          <AttendanceListing :group="record" />
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
import AttendanceListing from '~/components/database/pages/groups/AttendanceListing.vue';
import { BIconPencil } from 'bootstrap-vue';

export default Vue.extend({
  components: { ShowPage, ShowRecordLink, StudentsListing, AttendanceListing, BIconPencil },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
    };
  },
});
</script>
