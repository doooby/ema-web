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
    let value = this.dataItem[this.column.name];
    if (!Array.isArray(value)) value = [];
    if (!value[0] || typeof value[0] !== 'string') value[0] = '';
    if (!value[1] || typeof value[1] !== 'string') value[1] = '';
    return [ value[0], value[1] ];
  }
}
</script>
