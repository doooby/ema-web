<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Context } from '@nuxt/types';
import app from '~/lib/app';

@Component({
  layout: 'database',
  async asyncData (context: Context) {
    await app.session.fetchUser({
      api2: context.app.$api2,
      store: context.store,
    });
  },
})
class Base extends Vue {}

@Component
export default class CountryDBPage extends Vue {
  static ComponentBase = Base;

  get user (): null | app.session.User {
    return this.$store.state.session.user;
  }

  get country () {
    return this.$store.state.session.country;
  }

  get isLoaded (): boolean {
    return (!!this.user && !!this.country);
  }
}
</script>

<template>
  <div class="page-content">
    <transition name="fade-in">
      <div v-if="isLoaded">
        <slot />
      </div>
    </transition>
    <div
      v-if="!isLoaded"
      class="d-flex h-100 justify-content-center align-items-center"
    >
      <div class="card" style="max-width: 400px;">
        <div class="card-body d-flex flex-column align-items-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="mt-3">
            <t value="app.loading_country" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in-enter {
  opacity: 0;
}
.fade-in-enter-active {
  transition: opacity .2s ease-out;
}
</style>
