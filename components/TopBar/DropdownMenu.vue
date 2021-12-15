<template>
  <b-dropdown right no-caret variant="default">
    <template #button-content>
      <slot />
      <b-icon icon="list" variant="light" />
    </template>
    <b-dropdown-item @click="onShowLoginModal">
      <b-icon icon="person" class="emr-2" />
      <t value="top_bar.menu.action.login" />
      <login-modal />
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item @click="onShowLanguageModal">
      <b-icon icon="globe2" class="emr-2" />
      <t value="top_bar.menu.action.language" />
      <language-modal />
    </b-dropdown-item>
    <b-dropdown-divider />
    <li>
      <div class="py-1 px-4">
        <b-form-checkbox
          switch
          :value="!debugTranslations"
          @input="onToggleDebugTranslations"
        >
          <t value="top_bar.menu.action.debug_translations" />
        </b-form-checkbox>
      </div>
    </li>
  </b-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LoginModal from './LoginModal.vue';
import LanguageModal from './LanguageModal.vue';

@Component({
  components: {
    LoginModal,
    LanguageModal,
  },
})
export default class DropdownMenu extends Vue {
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
