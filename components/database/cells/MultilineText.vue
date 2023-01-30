<template>
  <pre class="m-0">{{ sanitizedValue }}</pre>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';

@Component
export default class Name extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get sanitizedValue (): string {
    return String(this.dataItem[this.column.name]);
  }
}
</script>
