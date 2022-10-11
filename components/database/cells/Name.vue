<template>
  <div class="single-row-cell">
    <div v-if="sanitizedValue[0]">
      {{ sanitizedValue[1] }}
      <br>
      <small>{{ sanitizedValue[0] }}</small>
    </div>
    <div v-else>
      {{ sanitizedValue[1] }}
    </div>
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
    return this.dataItem[this.column.name] ?? [];
  }
}
</script>
