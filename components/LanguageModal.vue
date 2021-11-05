<template>
  <b-modal
    :visible="shown"
    title="Language"
    hide-footer
    @hidden="onHidden"
  >
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
          {{ language }}
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  data () {
    return {
      languages: [ 'en', 'cs', 'pt', 'syr' ],
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
      this.$i18n.setLocale(locale);
    },
  },
});
</script>
