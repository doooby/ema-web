<template>
  <tr>
    <th scope="row">
      <t v-if="label" :value="label" />
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
  @Prop() readonly label?: string;
}
</script>
