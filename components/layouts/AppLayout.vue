<template>
  <div>
    <top-bar />
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { TopBar } from '~/components/TopBar';

@Component({
  components: { TopBar },
})
export default class AppLayout extends Vue {}
</script>
