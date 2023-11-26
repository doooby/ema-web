<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class RecordNamedValue extends Vue {}
</script>

<template>
  <div
    :class="[ $attrs.class, 'text-truncate lh-1' ]"
  >
    <span class="text-muted">
      <slot name="label" />
    </span>
    <br>
    <slot />
  </div>
</template>
