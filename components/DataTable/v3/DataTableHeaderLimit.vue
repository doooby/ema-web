<template>
  <div
    :class="['ema--data-table-header-limit', $attrs.class]"
    @mousedown="onDown"
    @dblclick="$emit('reset')"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class DataTableHeaderLimit extends Vue {
  onClearInjectedInteraction = null as null | (() => void);

  unmounted () {
    this.onClearInjectedInteraction?.();
  }

  onDown ({ x }) {
    this.onClearInjectedInteraction = injectMouseInteraction(this, x);
  }
}

function injectMouseInteraction (
  component: DataTableHeaderLimit,
  initialX: number,
): () => void {
  let previousX = initialX;

  function onMove ({ x }) {
    const xDiff = x - previousX;
    previousX = x;
    component.$emit('shift', xDiff);
  }

  function onUp () {
    clear();
  }

  window.document.body.addEventListener('mousemove', onMove);
  window.document.body.addEventListener('mouseup', onUp);

  function clear () {
    window.document.body.removeEventListener('mousemove', onMove);
    window.document.body.removeEventListener('mouseup', onUp);
  }

  return clear;
}
</script>

<style lang="scss">
@import "assets/css/variables";
.ema--data-table-header-limit {
  position: relative;
  cursor: col-resize;
  height: 2em;
  padding: 0 4px 0 4px;
  &::after {
    display: inline-block;
    content: ' ';
    border-right: 4px double $gray-700;
    height: 100%;
  }
}
</style>
