<template>
  <div>
    <top-bar />
    <div class="page-body">
      <resources-menu />
      <div v-if="userPresent">
        <Nuxt />
      </div>
      <div v-else>
        <b-alert show variant="info">
          {{ $t('db.shared.not_admissible') }}
        </b-alert>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TopBar from '~/components/database/TopBar.vue';
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
    return !!this.$store.state.session.currentUser;
  }
}
</script>
