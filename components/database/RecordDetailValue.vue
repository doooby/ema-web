<template>
  <div class="d-flex emb-2">
    <strong class="ew-14 em-r3">
      {{ label }}
    </strong>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    label: { type: String, required: true },
  },
});
</script>
