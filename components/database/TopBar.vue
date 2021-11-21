<template>
  <div class="d-flex db--top-bar">
    <nuxt-link
      class="h-100 ew-16"
      to="/"
      :title="$t('db.top_bar.logo')"
    >
      <b-img class="h-100" src="/ema.png" />
    </nuxt-link>
    <div class="flex-fill d-flex --links">
      <nuxt-link class="epx-4 epy-2 eh-100 text-decoration-none" to="/">
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon-house-door-fill variant="light" class="emr-3" />
          {{ $t('db.top_bar.home') }}
        </h2>
      </nuxt-link>
      <nuxt-link class="epx-4 epy-2 eh-100 text-decoration-none" to="/database">
        <h2 class="m-0 h-100 d-flex align-items-center text-light">
          <b-icon-server variant="light" class="emr-3" />
          {{ $t('db.top_bar.db') }}
        </h2>
      </nuxt-link>
    </div>
    <div>
      <b-dropdown right no-caret variant="default">
        <template #button-content>
          <b-icon-gear variant="light" />
        </template>
        <b-dropdown-item @click="onShowLoginModal">
          <b-icon-person class="emr-2" />
          {{ $t('db.top_bar.menu.login') }}
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item @click="onShowLanguageModal">
          <b-icon-globe2 class="emr-2" />
          {{ $t('db.top_bar.menu.language') }}
        </b-dropdown-item>
        <li class="epl-8">
          <b-form-checkbox
            switch
            :value="!debugTranslations"
            @input="onToggleDebugTranslations"
          >
            {{ $t('db.top_bar.menu.debugTranslations') }}
          </b-form-checkbox>
        </li>
      </b-dropdown>
      <login-modal />
      <language-modal />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BIconGear, BIconHouseDoorFill, BIconServer, BIconPerson, BIconGlobe2 } from 'bootstrap-vue';
import LoginModal from '~/components/LoginModal.vue';
import LanguageModal from '~/components/LanguageModal.vue';

@Component({
  components: {
    BIconGear,
    BIconHouseDoorFill,
    BIconServer,
    BIconPerson,
    BIconGlobe2,
    LoginModal,
    LanguageModal,
  },
})
export default class TopBar extends Vue {
  get debugTranslations (): boolean {
    const {
      currentUser,
      debugTranslations,
    } = this.$store.state.session;
    return !!(currentUser && debugTranslations);
  }

  onShowLoginModal () {
    this.$store.commit('session/showLoginModal');
  }

  onShowLanguageModal () {
    this.$store.commit('session/showLanguageModal');
  }

  onToggleDebugTranslations () {
    this.$store.commit('session/toggleDebugTranslations', !this.debugTranslations);
  }
}
</script>
