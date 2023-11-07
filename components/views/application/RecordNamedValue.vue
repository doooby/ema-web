<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class RecordNamedValue extends Vue {}
</script>

<template>
  <div
    :class="[ $attrs.class, 'text-truncate' ]"
  >
    <small class="text-muted">
      <slot name="label" />
    </small>
    <br>
    <slot />
  </div>
</template>
