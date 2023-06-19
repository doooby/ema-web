<template>
  <div class="d-flex top-bar">
    <nuxt-link
      class="h-100 ew-16"
      to="/"
    >
      <b-img class="h-100" src="/web/ema.png" />
    </nuxt-link>
    <div class="flex-fill d-flex --links">
      <nuxt-link class="epx-4 epy-2 eh-100 text-decoration-none" to="/">
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="house-door-fill" variant="light" class="emr-3" />
          <t value="top_bar.action.home" />
        </h2>
      </nuxt-link>
      <nuxt-link
        v-if="currentUser"
        to="/database"
        class="epx-4 epy-2 eh-100 text-decoration-none"
      >
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="server" variant="light" class="emr-3" />
          <t value="top_bar.action.db" />
        </h2>
      </nuxt-link>
      <nuxt-link
        to="/toolkit/charts"
        class="epx-4 epy-2 eh-100 text-decoration-none"
      >
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon icon="columns-gap" variant="light" class="emr-3" />
          Dashboard
        </h2>
      </nuxt-link>
    </div>
    <div class="d-flex align-items-stretch">
      <div
        v-if="currentUser"
        class="my-2 bg-white p-1 user-select-none d-flex flex-column --session"
      >
        <div class="text-truncate --session--row1">
          {{ currentUser.name[0] }}
        </div>
        <div class="text-truncate --session--row2">
          privileges: N/A
        </div>
      </div>
      <dropdown-menu />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DropdownMenu from './DropdownMenu.vue';
import app from '~/lib/app';

@Component({
  components: {
    DropdownMenu,
  },
})
export default class TopBar extends Vue {
  get currentUser (): null | app.session.User {
    return this.$store.state.session.user;
  }
}
</script>
