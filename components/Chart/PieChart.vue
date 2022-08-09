<template>
  <div class="card">
    <div class="card-body d-flex align-items-center">
      <div class="text-center">
        <div>
          {{ definition.caption }}
        </div>
        <div v-if="!definition.hideTotal" class="display-4">
          {{ total }}
        </div>
      </div>
      <div :style="containerStyle">
        <canvas ref="canvas" />
      </div>
      <div class="d-flex flex-column justify-content-center">
        <div
          v-for="item of definition.items"
          :key="item.text"
          class="d-flex align-items-center mb-1"
        >
          <div class="square-color mr-2" :style="{ backgroundColor: item.color }" />
          <div>
            <div class="text-11">
              {{ item.text }}
            </div>
            <div class="text-h-08">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Chart from 'chart.js/auto';

interface Definition {
  caption: string;
  hideTotal?: boolean;
  items: Item[];
}

interface Item {
  value: number;
  text: string;
  color: string;
}

@Component
export default class PieChart extends Vue {
  @Prop() definition!: Definition;
  width = 150;
  height = 150;

  get containerStyle () {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
    };
  }

  get total () {
    return this.definition.items.reduce((memo, item) => memo + item.value, 0);
  }

  mounted () {
    const canvas = this.$refs.canvas as any;
    const { items } = this.definition;
    new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        datasets: [ {
          data: items.map(item => item.value),
          backgroundColor: items.map(item => item.color),
        } ],
      },
    });
  }
}
</script>
