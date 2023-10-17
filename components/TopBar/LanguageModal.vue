<template>
  <b-modal
    :visible="shown"
    hide-footer
    @hidden="onHidden"
  >
    <template #modal-title>
      <t value="top_bar.menu.action.language" />
    </template>
    <div v-if="shown">
      <b-list-group>
        <b-list-group-item
          v-for="language in languages"
          :key="language"
          button
          :disabled="loading"
          :active="language === currentLocale"
          @click="onSelectLocale(language)"
        >
          <small>[{{ language }}]</small>
          <strong><t :value="`app.locales.${language}.language_name`" /></strong>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import app from '~/lib/app';

export default Vue.extend({
  data () {
    return {
      languages: app.locales.KNOWN_LOCALES,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      shown: (state: any) => state.session.languageModalShown,
    }),
    currentLocale () {
      return this.$i18n.locale;
    },
  },
  methods: {
    onHidden () {
      this.$store.commit('session/hideLanguageModal');
    },
    onSelectLocale (locale: string) {
      this.$ema.setLocale(locale);
    },
  },
});
</script>
