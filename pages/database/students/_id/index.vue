<template>
  <show-page
    entity="students"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <record-detail-value label="Name">
          {{ record.last_name_en }}, {{ record.first_name_en }}
          <br>
          {{ record.last_name }}, {{ record.first_name }}
        </record-detail-value>
        <record-detail-value label="Date of Birth">
          {{ formatDate(record.born_on) }}
        </record-detail-value>

        <record-detail-value label="Gender">
          {{ record.gender }}
        </record-detail-value>
        <record-detail-value label="Residency Status">
          {{ record.residency }}
        </record-detail-value>
        <record-detail-value label="Language">
          {{ record.language }}
        </record-detail-value>
        <record-detail-value label="Region">
          {{ record.region }}
        </record-detail-value>
        <record-detail-value label="Address">
          {{ record.address }}
        </record-detail-value>
        <record-detail-value label="Mother's Name">
          {{ record.mother_first_name_en }}, {{ record.mother_last_name_en }}
          <br>
          {{ record.mother_first_name }}, {{ record.mother_last_name }}
        </record-detail-value>
        <record-detail-value label="Father's Name">
          {{ record.father_first_name_en }}, {{ record.father_last_name_en }}
          <br>
          {{ record.father_first_name }}, {{ record.father_last_name }}
        </record-detail-value>
        <record-detail-value label="Caregiver's Name">
          {{ record.caregiver_first_name_en }}, {{ record.caregiver_last_name_en }}
          <br>
          {{ record.caregiver_first_name }}, {{ record.caregiver_last_name }}
        </record-detail-value>
        <record-detail-value label="Caregiver's ID">
          {{ record.caregiver_id }}
        </record-detail-value>
        <record-detail-value label="Caregiver's Contact">
          {{ record.caregiver_contact }}
        </record-detail-value>
        <record-detail-value label="Caregiver CFW">
          {{ record.caregiver_cfw }}
        </record-detail-value>
        <record-detail-value label="Caregiver's Humansis ID">
          {{ record.caregiver_humansis }}
        </record-detail-value>
        <record-detail-value label="disability">
          {{ record.disability }}
        </record-detail-value>
        <record-detail-value label="Disability Diagnosis">
          {{ record.disability_diagnosis }}
        </record-detail-value>
        <record-detail-value label="Assistance Needed">
          <div
            v-for="option in assistanceNeededSelected(record.assistance_needed)"
            :key="option.value"
          >
            {{ option.caption }}
          </div>
        </record-detail-value>
        <record-detail-value label="out of school before enrolment">
          {{ record.oos_before }}
        </record-detail-value>
        <record-detail-value label="Date of Enrolment">
          {{ formatDate(record.enrolment_on) }}
        </record-detail-value>
      </div>

      <!--      -->
      <!--      -->
      <!--      <div class="d-flex emb-3">-->
      <!--        <record-detail-value label="Address:">-->
      <!--          {{ record.address }}-->
      <!--        </record-detail-value>-->
      <!--        -->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.name') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.last_name_en }}, {{ record.first_name_en }}-->
      <!--          <br>-->
      <!--          {{ record.last_name }}, {{ record.first_name }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.born_on') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ formatDate(record.born_on) }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.gender') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.gender }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.language') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.language }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.address') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.address }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.residency') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.residency }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.distance_school_km') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.distance_school_km }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.distance_school_time') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.distance_school_time }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.caregivers_en') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.caregivers_en }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.caregivers') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.caregivers }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.caregivers_contact') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.caregivers_contact }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--&lt;!&ndash;      <div class="d-flex emb-3">&ndash;&gt;-->
      <!--&lt;!&ndash;        <strong class="ew-18 em-r3">&ndash;&gt;-->
      <!--&lt;!&ndash;          {{ $t('record.students.caregivers_cfw') }}&ndash;&gt;-->
      <!--&lt;!&ndash;        </strong>&ndash;&gt;-->
      <!--&lt;!&ndash;        <div>&ndash;&gt;-->
      <!--&lt;!&ndash;          {{ caregivers_cfwToText(record) }}&ndash;&gt;-->
      <!--&lt;!&ndash;        </div>&ndash;&gt;-->
      <!--&lt;!&ndash;      </div>&ndash;&gt;-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.out_of_school') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.out_of_school }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.enrolment_on') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ formatDate(record.enrolment_on) }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.completion_on') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ formatDate(record.completion_on) }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.dropped_out_on') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ formatDate(record.dropped_out_on) }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.drop_out_reason') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ record.drop_out_reason }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="d-flex emb-3">-->
      <!--        <strong class="ew-18 em-r3">-->
      <!--          {{ $t('record.students.disability') }}-->
      <!--        </strong>-->
      <!--        <div>-->
      <!--          {{ disabilityToText(record) }}-->
      <!--        </div>-->
      <!--      </div>-->
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import { formatISO } from 'date-fns';
import { student } from '~/lib/records';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';

export default Vue.extend({
  components: { ShowPage, RecordDetailValue },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => `${record.last_name_en}, ${record.first_name_en}`,
        showEditLink: true,
      },
    };
  },
  methods: {
    formatDate (date?: Date): string {
      if (!date) return '';
      return formatISO(date, { representation: 'date' });
    },
    assistanceNeededSelected: student.assistanceNeededSelected,
    // caregivers_cfwToText: student.caregivers_cfwToText,
    // disabilityToText: student.disabilityToText,
  },
});
</script>
