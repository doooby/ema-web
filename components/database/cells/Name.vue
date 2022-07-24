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
import { maybe, prop, tuple, val } from '~/lib/api/mappers';

@Component
export default class Name extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get sanitizedValue (): [string, string] {
    return maybe(this.dataItem[this.column.name],
      value => tuple(value, items => [
        prop('0', items, val.string),
        prop('1', items, val.string),

      ]),
    ) ?? [ '', '' ];
  }
}
</script>
