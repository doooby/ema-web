<template>
  <b-modal
    :visible="shown"
    hide-footer
    @show="onShow"
    @hidden="onHidden"
  >
    <template #modal-title>
      <t value="top_bar.menu.action.login" />
    </template>
    <div v-if="shown">
      <div v-if="currentUser">
        <b-alert :show="!!currentUser" variant="primary">
          You are logged-in.
        </b-alert>
        <p>
          <i>{{ currentUser.login }}</i><br>
          <strong>{{ currentUser.name[0] }}</strong><br>
          <small>{{ currentUser.name[1] }}</small><br>
          <small
            v-for="(country, index) of currentUser.countries"
            :key="country.id"
          >
            <span v-if="index !== 0">, </span>
            {{ country.caption }}
          </small>
        </p>
        <div class="text-right">
          <b-button variant="warning" @click="onLogOut">
            Log out
          </b-button>
        </div>
      </div>
      <b-form v-else @submit="onLoginSubmit">
        <b-form-group
          label="country"
          label-for="login-country"
        >
          <b-form-select
            id="login-country"
            v-model="form.country"
            :disabled="!countriesOptions.length"
            :options="countriesOptions"
          />
        </b-form-group>
        <b-form-group
          label="Login"
          label-for="login-login"
        >
          <b-form-input
            id="login-login"
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
          <t :value="`app.LoginModal.fail.${form.error}`" />
        </b-alert>
      </b-form>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export default Vue.extend({
  data () {
    return {
      countries: undefined as app.Maybe<wai.AResource[]>,
      form: {
        country: '',
        login: '',
        password: '',
        error: null as null | string,
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state: any): null | app.session.User => state.session.user,
      shown: (state: any) => state.session.loginModalShown,
    }),
    countriesOptions (): { value: string; text: string }[] {
      return (this.countries ?? []).map(({ id, caption }) => ({
        value: id ?? '-1',
        text: caption ?? id ?? 'Unknown',
      }));
    },
  },
  methods: {
    onShow () {
      this.form.country = '2';
      this.form.login = '';
      this.form.password = '';
      this.form.error = null;
      this.onLoadCountries();
    },

    onHidden () {
      if (this.shown) this.$store.commit('session/hideLoginModal');
      this.countries = undefined;
    },

    async onLoadCountries () {
      const response = await this.$api2.transientRequest(
        {
          pathIsFull: true,
          path: '/public/countries',
          reducer: a => a,
        },
      );
      if (response.ok && response.payload) {
        this.countries = (response.payload as any).list;
      }
    },

    async onLoginSubmit (event: any) {
      event.preventDefault();

      const { country, login, password } = this.form;
      const loginResult = await this.$api2.transientRequest2(
        app.session.queries.login(
          { country, login, password },
        ),
      );

      if (!loginResult.ok) {
        this.form.error = loginResult.reason || 'bad_login';
        return;
      }

      this.$store.commit('session/hideLoginModal');

      await app.session.fetchUser({
        api2: this.$api2,
        store: this.$store,
      });
    },

    async onLogOut () {
      await this.$api2.transientRequest2(
        app.session.queries.logout(),
      );
      this.$store.commit('session/clearUser');
    },

  },
});
</script>
