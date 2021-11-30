<template>
  <app-layout>
    <div v-if="userPresent">
      <Nuxt />
    </div>
    <div v-else>
      <b-alert show variant="info">
        <t value="db.shared.not_admissible" />
      </b-alert>
      <b-alert show variant="info">
        <t value="dev.page_may_not_inherit_session_mixin" />
      </b-alert>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { AppLayout } from '~/components';

@Component({
  components: { AppLayout },
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
