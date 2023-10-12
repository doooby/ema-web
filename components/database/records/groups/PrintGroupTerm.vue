<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class PrintGroupTerm extends Vue {
    @Prop({ required: true }) readonly dates!: [Date, Date];
}
</script>

<template>
  <div>
    {{ $ema.localizeDate(dates[0]) }}
    -
    {{ $ema.localizeDate(dates[1]) }}
  </div>
</template>
