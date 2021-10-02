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
      languages: [ 'en', 'cs' ],
      loading: false,
      // form: {
      //   login: '',
      //   password: '',
      //   error: null as null | string,
      // },
    };
  },
  computed: {
    ...mapState({
      shown: (state: any) => state.user.languageModalShown,
    }),
    currentLocale () {
      return this.$i18n.locale;
    },
  },
  // async mounted () {
  //   const result = await this.$api.request(
  //     this.$api.queries.session.show(),
  //     this.$api.newQueryState(),
  //   );
  //   if (result) {
  //     this.$store.commit('user/setCurrentUser', result);
  //   }
  // },
  methods: {
    onHidden () {
      this.$store.commit('user/hideLanguageModal');
    },
    onSelectLocale (locale: string) {
      this.$i18n.setLocale(locale);
    },
    // async onLoginSubmit (event: any) {
    //   event.preventDefault();
    //
    //   const { login, password } = this.form;
    //   const result = await this.$api.request(
    //     this.$api.queries.session.login({ login, password }),
    //     this.$api.newQueryState(),
    //   );
    //   if (result) {
    //     this.$store.commit('user/setCurrentUser', result);
    //     this.$store.commit('user/hideLoginModal');
    //   } else {
    //     this.form.error = 'invalid login';
    //   }
    // },
  },
});
</script>
