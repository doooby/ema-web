<template>
  <div>
    <slot v-if="loaded" />
    <b-progress
      v-else
      height="2px"
      :value="100"
      variant="info"
      striped
      animated
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as localStorage from '~/lib/localStorage';
import { CountryData } from '~/store/session/country';

@Component
export default class DatabasePageLoaded extends Vue {
  get loaded (): boolean {
    return !!this.$store.state.session.country;
  }

  beforeMount () {
    const user = this.$store.state.session.currentUser;
    let country: null | CountryData = null;
    if (user) {
      const savedId = localStorage.get(localStorage.values.currentCountry)?.id;
      country = user.countries.find(country => country.id === savedId) ??
        user.countries[0] ?? null;
    }

    if (country !== this.$store.state.session.country?.country) {
      this.$store.dispatch('session/switchCountry', {
        country,
        api: this.$api,
      });
    }
  }
}
</script>
