<template>
  <div>
    <top-bar />
    <div class="position-relative page-body">
      <Nuxt v-if="userPresent" />
      <div v-else>
        <b-alert show variant="info">
          <t value="app.user_not_present" />
        </b-alert>
        <b-alert show variant="info">
          <t value="dev.page_may_not_inherit_session_mixin" />
        </b-alert>
      </div>
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
export default class LayoutApp extends Vue {
  get userPresent (): boolean {
    return !!this.$store.state.session.currentUser;
  }
}
</script>
