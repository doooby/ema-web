<template>
  <show-page
    entity="students"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.name') }}
        </strong>
        <div>
          {{ record.last_name_en }}, {{ record.first_name_en }}
          <br>
          {{ record.last_name }}, {{ record.first_name }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.born_on') }}
        </strong>
        <div>
          {{ formatDate(record.born_on) }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.gender') }}
        </strong>
        <div>
          {{ record.gender }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.language') }}
        </strong>
        <div>
          {{ record.language }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.address') }}
        </strong>
        <div>
          {{ record.address }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.residency') }}
        </strong>
        <div>
          {{ record.residency }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.distance_school_km') }}
        </strong>
        <div>
          {{ record.distance_school_km }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.distance_school_time') }}
        </strong>
        <div>
          {{ record.distance_school_time }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.caregivers_en') }}
        </strong>
        <div>
          {{ record.caregivers_en }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.caregivers') }}
        </strong>
        <div>
          {{ record.caregivers }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.caregivers_contact') }}
        </strong>
        <div>
          {{ record.caregivers_contact }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.caregivers_cfw') }}
        </strong>
        <div>
          {{ caregivers_cfwToText(record) }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.out_of_school') }}
        </strong>
        <div>
          {{ record.out_of_school }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.enrolment_on') }}
        </strong>
        <div>
          {{ formatDate(record.enrolment_on) }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.completion_on') }}
        </strong>
        <div>
          {{ formatDate(record.completion_on) }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.dropped_out_on') }}
        </strong>
        <div>
          {{ formatDate(record.dropped_out_on) }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.drop_out_reason') }}
        </strong>
        <div>
          {{ record.drop_out_reason }}
        </div>
      </div>
      <div class="d-flex emb-3">
        <strong class="ew-18 em-r3">
          {{ $t('record.students.disability') }}
        </strong>
        <div>
          {{ disabilityToText(record) }}
        </div>
      </div>
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import { formatISO } from 'date-fns';
import { student } from '~/lib/records';

export default Vue.extend({
  components: { ShowPage },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => record.full_name,
        showEditLink: true,
      },
    };
  },
  methods: {
    formatDate (date?: Date): string {
      if (!date) return '';
      return formatISO(date, { representation: 'date' });
    },
    caregivers_cfwToText: student.caregivers_cfwToText,
    disabilityToText: student.disabilityToText,
  },
});
</script>
