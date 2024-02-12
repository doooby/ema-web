<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PieChart from '~/components/Chart/PieChart.vue';
import { statistics } from '~/lib/records';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';

@Component({
  components: { LoadingBlock, PieChart },
})
export default class CountryDashboard extends Vue {
  resource = this.$api2.resourceState(
    statistics.country_stats.queries.show_country_homepage_data(),
  );

  mounted () {
    this.resource.onReload?.();
  }

  get sums () {
    if (!this.resource.resource?.record) return;

    return Object.freeze({

      studentsTotal: {
        caption: 'Students No.',
        items: [
          {
            text: 'boys',
            value: this.resource.resource.record.main.students.boys,
            color: '#143a9f',
          },
          {
            text: 'girls',
            value: this.resource.resource.record.main.students.girls,
            color: '#933030',
          },
        ],
      },

      teachersTotal: {
        caption: 'Teachers No.',
        items: [
          {
            text: 'men',
            value: 0,
            color: '#143a9f',
          },
          {
            text: 'women',
            value: 0,
            color: '#933030',
          },
        ],
      },

      schoolsFormalInformal: {
        caption: 'Schools No.',
        items: [
          {
            text: 'formal',
            value: this.resource.resource.record.main.schools.formal,
            color: '#148119',
          },
          {
            text: 'informal',
            value: this.resource.resource.record.main.schools.non_formal,
            color: '#83682f',
          },
        ],
      },

    });
  }
}
</script>

<template>
  <LoadingBlock
    class="container"
    :is-loading="resource.isLoading"
    :fail-message="resource.failReason ? 'app.processing.not_found' : undefined"
  >

    <div class="row mb-4">

      <div class="col-6">
        <div class="d-flex justify-content-center">
          <PieChart v-if="sums" :definition="sums.studentsTotal" />
        </div>
      </div>

      <div class="col-6">
        <div class="d-flex justify-content-center">
          <PieChart v-if="sums" :definition="sums.teachersTotal" />
        </div>
      </div>

    </div>

    <div class="row mb-4">

      <div class="col-4">
        <div class="d-flex justify-content-center">
          <PieChart v-if="sums" :definition="sums.schoolsFormalInformal" />
        </div>
      </div>

    </div>

  </LoadingBlock>
</template>
