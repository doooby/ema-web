<template>
  <div>
    <top-bar />
    <div class="page-body">
      <resources-menu v-if="userPresent" />
      <div v-if="userPresent">
        <Nuxt />
      </div>
      <div v-else class="p-3">
        <b-alert show variant="info">
          <t value="app.user_not_present" />
        </b-alert>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { TopBar } from '~/components/TopBar';
import ResourcesMenu from '~/components/database/ResourcesMenu.vue';

@Component({
  components: { TopBar, ResourcesMenu },
  head: {
    bodyAttrs: {
      class: 'body-database',
    },
  },
})
export default class LayoutDatabase extends Vue {
  get userPresent (): boolean {
    return !!this.$store.state.session.user;
  }
}
</script>
