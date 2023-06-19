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
          {{ form.error }}
        </b-alert>
      </b-form>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { RequestResponse } from '~/lib/api';
import { AssociatedRecord } from '~/lib/api/mappers';
import app from '~/lib/app';

export default Vue.extend({
  data () {
    return {
      countries: undefined as undefined | AssociatedRecord[],
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
      return (this.countries ?? []).map(country => ({
        value: String(country.id),
        text: country.labels.caption as string,
      }));
    },
  },
  mounted () {
    loadCountries().then((countries) => {
      if (countries.ok) {
        this.countries = countries.data;
      }
    });
  },
  methods: {
    onShow () {
      this.form.country = '2';
      this.form.login = '';
      this.form.password = '';
      this.form.error = null;
    },
    onHidden () {
      if (this.shown) this.$store.commit('session/hideLoginModal');
    },
    async onLoginSubmit (event: any) {
      event.preventDefault();

      const { country, login, password } = this.form;
      const result = await this.$api.request(
        this.$api.queries.session.login({ country, login, password }),
        this.$api.newQueryState(),
      );
      await this.$store.dispatch('session/fetchSession', {
        api: this.$api,
      });
      if (result) {
        this.$store.commit('session/hideLoginModal');
      } else {
        this.form.error = 'invalid login';
      }
    },
    async onLogOut () {
      await this.$api.request(
        this.$api.queries.session.logout(),
        this.$api.newQueryState(),
      );
      await this.$store.dispatch('session/fetchSession', {
        api: this.$api,
      });
    },
  },
});

async function loadCountries () {
  try {
    const rawResponse = await globalThis.fetch('/public/countries');
    const { ok, payload }: RequestResponse = await rawResponse.json();
    return { ok, data: payload.list as AssociatedRecord[] };
  } catch (error) {
    return { ok: false };
  }
}
</script>
