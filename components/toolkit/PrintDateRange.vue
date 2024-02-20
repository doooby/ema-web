<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import app from '~/lib/app';

@Component({
  components: { PrintDate },
})
export default class PrintDateRange extends Vue {
  @Prop({ required: true }) readonly dates!: app.List<app.Maybe<Date>>;
}
</script>

<template>
  <div class="d-flex align-items-center">
    <PrintDate :value="dates[0]" />
    <span class="mx-1">-</span>
    <PrintDate :value="dates[1]" />
  </div>
</template>
