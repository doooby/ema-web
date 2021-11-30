<template>
  <div>
    top bar
    <hr>
<!--    <top-bar />-->
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppLayout extends Vue {

}
</script>
