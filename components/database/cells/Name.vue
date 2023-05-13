<template>
  <text-names :value="sanitizedValue" class="single-row-cell" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import TextNames from '~/components/database/components/TextNames.vue';

@Component({
  components: { TextNames },
})
export default class Name extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get sanitizedValue (): [string, string] {
    return this.dataItem[this.column.name] ?? [];
  }
}
</script>
