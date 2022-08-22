<template>
  <div class="--column-limit" @mousedown="onDown" @dblclick="onDoubleClick" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ColumnLimit extends Vue {
  onClearInjectedInteraction = null as null | (() => void);

  unmounted () {
    this.onClearInjectedInteraction?.();
  }

  onDown ({ x }) {
    this.onClearInjectedInteraction = injectMouseInteraction(this, x);
  }

  onDoubleClick () {
    this.$emit('reset');
  }
}

function injectMouseInteraction (component: ColumnLimit, initialX: number): () => void {
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
