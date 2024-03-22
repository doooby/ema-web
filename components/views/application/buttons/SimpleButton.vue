<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SimpleButton extends Vue {}
</script>

<template>
  <button
    type="button"
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
