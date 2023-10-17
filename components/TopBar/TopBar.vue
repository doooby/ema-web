<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DropdownMenu from './DropdownMenu.vue';
import UserPrivileges from '~/components/database/records/users/views/UserPrivileges.vue';

@Component({
  components: {
    UserPrivileges,
    DropdownMenu,
  },
})
export default class TopBar extends Vue {
  get userSession () { return this.$ema.userSession; }
}
</script>

<template>
  <div class="d-flex top-bar">
    <nuxt-link
      class="h-100 ew-16"
      to="/"
    >
      <b-img class="h-100" src="/web/ema.png" />
    </nuxt-link>
    <div class="d-flex --links">
      <nuxt-link class="epx-4 epy-2 text-decoration-none" to="/">
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="house-door-fill" variant="light" class="emr-3" />
          <t value="top_bar.action.home" />
        </h2>
      </nuxt-link>
      <nuxt-link
        v-if="userSession"
        to="/database"
        class="epx-4 epy-2 text-decoration-none"
      >
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="server" variant="light" class="emr-3" />
          <t value="top_bar.action.db" />
        </h2>
      </nuxt-link>
      <nuxt-link
        to="/toolkit/charts"
        class="epx-4 epy-2 text-decoration-none"
      >
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="columns-gap" variant="light" class="emr-3" />
          <t value="top_bar.action.dashboard" />
        </h2>
      </nuxt-link>
    </div>
    <div style="flex: 1 1 auto;" />
    <div
      v-if="userSession"
      class="session d-flex align-items-center text-white"
    >
      <div class="text-truncate">
        <t
          class="font-12"
          value="top_bar.session.user"
        />
        <br>
        <strong>
          {{ userSession.name[0] }}
        </strong>
      </div>
    </div>
    <div class="d-flex">
      <dropdown-menu />
    </div>
  </div>
</template>

<style scoped>
.session {
  max-width: 200px;
}
</style>
