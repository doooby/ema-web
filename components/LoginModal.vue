<template>
  <b-modal
    :visible="shown"
    title="Login"
    hide-footer
    @show="onShow"
    @hidden="onHidden"
  >
    <div v-if="currentUser">
      <b-alert :show="currentUser !== null" variant="primary">
        You are already logged-in as {{ currentUser.login }} <br>
        <strong>{{ currentUser.name_en }}</strong> <br>
        <small>{{ currentUser.name }}</small>
      </b-alert>
      <div class="text-right">
        <b-button variant="warning" @click="onLogOut">
          Log out
        </b-button>
      </div>
    </div>
    <b-form v-else @submit="onLoginSubmit">
      <b-form-group
        label="Login"
        label-for="login-login"
      >
        <b-form-input
          id="input-1"
          v-model="form.login"
          type="text"
        />
      </b-form-group>
      <b-form-group
        label="Password"
        label-for="login-password"
      >
        <b-form-input
          id="login-password"
          v-model="form.password"
          type="password"
        />
      </b-form-group>
      <div class="text-right">
        <b-button type="submit" variant="primary">
          Login
        </b-button>
      </div>
      <b-alert :show="form.error !== null" variant="danger" class="emt-4">
        {{ form.error }}
      </b-alert>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  data () {
    return {
      form: {
        login: '',
        password: '',
        error: null as null | string,
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state: any) => state.user.currentUser,
      shown: (state: any) => state.user.loginModalShown,
    }),
  },
  async mounted () {
    const result = await this.$api.request(
      this.$api.queries.session.show(),
      this.$api.newQueryState(),
    );
    if (result) {
      this.$store.commit('user/setCurrentUser', result);
    }
  },
  methods: {
    onShow () {
      this.form.login = '';
      this.form.password = '';
      this.form.error = null;
    },
    onHidden () {
      this.$store.commit('user/hideLoginModal');
    },
    async onLoginSubmit (event: any) {
      event.preventDefault();

      const { login, password } = this.form;
      const result = await this.$api.request(
        this.$api.queries.session.login({ login, password }),
        this.$api.newQueryState(),
      );
      if (result) {
        this.$store.commit('user/setCurrentUser', result);
        this.$store.commit('user/hideLoginModal');
      } else {
        this.form.error = 'invalid login';
      }
    },
    async onLogOut () {
      await this.$api.request(
        this.$api.queries.session.logout(),
        this.$api.newQueryState(),
      );
      this.$store.commit('user/setCurrentUser', null);
    },
  },
});
</script>
