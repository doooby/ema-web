<template>
  <div class="container emy-4">
    <h2 class="text-center">
      North-West Syria
    </h2>
    <div class="text-center mb-5 d-flex align-items-center justify-content-center">
      <span class="mr-3">project:</span>
      <div class="width-px-300 form--group">
        <select-with-modal value="" :options-source="projectsListSource" />
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-6">
        <div class="d-flex justify-content-center">
          <pie-chart :definition="sums.studentsTotal" />
        </div>
      </div>
      <div class="col-6">
        <div class="d-flex justify-content-center">
          <pie-chart :definition="sums.teachersTotal" />
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-4">
        <div class="d-flex justify-content-center">
          <pie-chart :definition="sums.schoolsFormalInformal" />
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex justify-content-center">
          <pie-chart :definition="sums.schoolsType" />
        </div>
      </div>
      <div class="col-4">
        <div class="d-flex justify-content-center">
          <pie-chart :definition="sums.schoolsLevel" />
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-6">
        <div class="d-flex justify-content-center">
          <grades-distribution :definition="sums.studentsNoPerGrades" />
        </div>
      </div>
      <div class="col-6">
        <div class="d-flex justify-content-center">
          <grades-distribution :definition="sums.studentsAgePerGrades" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PieChart from '~/components/Chart/PieChart.vue';
import SelectWithModal from '~/components/Form/primitives/SelectWithModal.vue';
import GradesDistribution from '~/components/Chart/GradesDistribution.vue';

@Component({
  components: { PieChart, SelectWithModal, GradesDistribution },
})
export default class Charts extends Vue {
  projectsListSource = Object.freeze({
    list: [
      { value: '1', text: 'Project 1' },
      { value: '2', text: 'Project 2' },
    ],
  });

  sums = Object.freeze({
    // row 1
    studentsTotal: {
      caption: 'Students No.',
      items: [
        { text: 'boys', value: 2354, color: '#143a9f' },
        { text: 'girls', value: 1971, color: '#933030' },
      ],
    },
    teachersTotal: {
      caption: 'Teachers No.',
      items: [
        { text: 'men', value: 47, color: '#143a9f' },
        { text: 'women', value: 12, color: '#933030' },
      ],
    },
    // row 2
    schoolsFormalInformal: {
      caption: 'Schools No.',
      items: [
        { text: 'formal', value: 47, color: '#148119' },
        { text: 'informal', value: 26, color: '#83682f' },
      ],
    },
    schoolsType: {
      caption: 'Schools by Category',
      hideTotal: true,
      items: [
        { text: 'CFS', value: 4, color: '#b6b21f' },
        { text: 'formal school', value: 47, color: '#359b5e' },
        { text: 'informal', value: 26, color: '#83682f' },
        { text: 'learning space', value: 6, color: '#842994' },
        { text: 'temporary learning space', value: 16, color: '#b22a3e' },
      ],
    },
    schoolsLevel: {
      caption: 'Schools by EducationLevel',
      hideTotal: true,
      items: [
        { text: 'ECD', value: 2, color: '#b6b21f' },
        { text: 'primary', value: 41, color: '#359b5e' },
        { text: 'secondary', value: 7, color: '#83682f' },
        { text: 'higher', value: 10, color: '#842994' },
        { text: 'vocational', value: 13, color: '#b22a3e' },
      ],
    },
    // row 3
    studentsNoPerGrades: {
      caption: 'Students No. per Grade',
      datasets: [
        {
          label: 'F',
          data: [ 65, 59, 80, 81, 56, 55, 40, 34 ],
          backgroundColor: '#933030',
        },
        {
          label: 'M',
          data: [ 59, 80, 81, 56, 55, 40, 34, 43 ],
          backgroundColor: '#143a9f',
        },
      ],
      sum: {
        type: 'sum',
        label: 'Sum',
        backgroundColor: '#148119',
      },
    },
    studentsAgePerGrades: {
      caption: 'Students avg Age. per Grade',
      datasets: [
        {
          label: 'F',
          data: [ 6.5, 7.1, 8.8, 9.8, 10.8, 11.6, 12.5, 13.4 ],
          backgroundColor: '#933030',
        },
        {
          label: 'M',
          data: [ 6.2, 7.8, 8.2, 9.1, 10.2, 11.4, 12.3, 13 ],
          backgroundColor: '#143a9f',
        },
      ],
      sum: {
        type: 'avg',
        label: 'Combined',
        backgroundColor: '#148119',
      },
    },
  });
}
</script>
CFS, formal school, learning space, temporary learning space, digital learning centre, other
