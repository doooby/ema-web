<template>
  <tr>
    <th scope="row">
      <t :value="labelKey" />
    </th>
    <td>
      <slot />
    </td>
  </tr>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ShowPageTableRow extends Vue {
  @Prop({ required: true }) readonly label!: string;

  get labelKey (): string {
    return this.label;
  }
}
</script>
