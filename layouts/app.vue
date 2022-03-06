<template>
  <div>
    <top-bar />
    <div class="position-relative page-body">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { TopBar } from '~/components/TopBar';

@Component({
  components: { TopBar },
  head: {
    bodyAttrs: {
      class: 'body-app',
    },
  },
})
export default class LayoutApp extends Vue {}
</script>
