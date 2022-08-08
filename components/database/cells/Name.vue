<template>
  <div class="single-row-cell">
    {{ sanitizedValue[0] }}
    <br>
    <small>{{ sanitizedValue[1] }}</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';

@Component
export default class Name extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get sanitizedValue (): [string, string] {
    return this.dataItem[this.column.name];
  }
}
</script>
