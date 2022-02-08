<template>
  <div class="single-row-cell">
    {{ $d(dataItem[column.name]) }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';

@Component
export default class Date extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;
}
</script>
