<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class PrintAttendance extends Vue {
    @Prop({ required: true }) text!: string;
    @Prop({ required: true }) present!: number;
    @Prop() must?: number;
    @Prop() strong?: boolean;

    get percentage () {
      if (!this.must) return null;
      return (this.present / this.must) * 100;
    }
}
</script>

<template>
  <div>
    <t :value="text" />
    <span>: </span>
    {{ must ?? 0 }}
    <span v-if="percentage !== null"> |&nbsp;</span>
    <span
      v-if="percentage !== null"
      :class="{ 'font-weight-bold': strong }"
    >{{ percentage.toFixed(2) }}&nbsp;%</span>
  </div>
</template>
