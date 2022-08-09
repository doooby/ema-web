<template>
  <div class="card">
    <div class="card-title pt-3 px-5 mb-0">
      {{ definition.caption }}
    </div>
    <div class="card-body">
      <div :style="containerStyle">
        <canvas ref="canvas" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Chart from 'chart.js/auto';

interface Definition {
  caption: string;
  datasets: Set[];
  sum: {
    type: 'sum' | 'avg'
    label: string;
    backgroundColor: string;
  }
}

interface Set {
  label: string;
  data: number[];
  backgroundColor: string;
}

@Component
export default class GradesDistribution extends Vue {
  @Prop() definition!: Definition;
  width = 450;
  height = 240;

  get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
    };
  }

  mounted () {
    const canvas = this.$refs.canvas as any;
    const { datasets } = this.definition;

    const labels = [ 'EL1 G1', 'EL1 G2', 'EL1 G3', 'EL1 G4', 'EL1 G5', 'EL2 G1', 'EL2 G2', 'EL2 G3' ];

    const sums: number[] = [];
    switch (this.definition.sum.type) {
      case 'sum':
        for (let i = 0; i < labels.length; i += 1) {
          sums[i] = datasets[0].data[i] + datasets[1].data[i];
        }
        break;
      case 'avg':
        for (let i = 0; i < labels.length; i += 1) {
          sums[i] = (datasets[0].data[i] + datasets[1].data[i]) / 2;
        }
        break;
    }

    const sumDataset: Set = {
      label: this.definition.sum.label,
      backgroundColor: this.definition.sum.backgroundColor,
      data: sums,
    };

    const data = {
      labels,
      datasets: [
        ...datasets,
        sumDataset,
      ],
    };

    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data,
      options: {
        scales: {
          y: {
            // beginAtZero: true,
          },
        },
      },

      // type: 'bar',
      // data: {
      //   datasets: [ {
      //     label: 'My First Dataset',
      //     data: [ 65, 59, 80, 81, 56, 55, 40 ],
      //     backgroundColor: [
      //       'rgba(255, 99, 132, 0.2)',
      //       'rgba(255, 159, 64, 0.2)',
      //       'rgba(255, 205, 86, 0.2)',
      //       'rgba(75, 192, 192, 0.2)',
      //       'rgba(54, 162, 235, 0.2)',
      //       'rgba(153, 102, 255, 0.2)',
      //       'rgba(201, 203, 207, 0.2)',
      //     ],
      //     // data: items.map(item => item.value),
      //     // backgroundColor: items.map(item => item.color),
      //   } ],
      // },
      // options: {
      //   scales: {
      //     y: {
      //       // stacked: true,
      //     },
      //   },
      // },
    });
  }
}
</script>
