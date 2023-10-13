<template>
  <div v-if="viableCountries.length > 1">
    <form-group
      :value="{ country: currentCountryId }"
      :fields="fields"
      name-prefix="resources_menu"
      @input="onSelectCountry"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { buildFormFields, controls, FormField } from '~/components/Form';
import { BRecord } from '~/lib/api2';
import app from '~/lib/app';
import { queries } from '~/lib/app/session';

@Component
export default class ResourcesMenuCountrySwitch extends Vue {
  get viableCountries (): BRecord[] {
    return this.$store.state.session.user?.countries ?? [];
  }

  get currentCountryId (): null | number {
    return this.$store.getters['session/countryId'];
  }

  get fields (): FormField[] {
    const label = this.$t('db.menu.switch_country');
    const options = this.viableCountries.map(country => ({
      value: country.id,
      text: country.caption,
    }));
    return buildFormFields([
      [ 'country', controls.select, { label, options } ],
    ]);
  }

  async onSelectCountry (value: any) {
    const { country: countryId } = value;
    const country = this.viableCountries.find(item => item.id === countryId);
    if (!country) return;
    this.$store.commit('session/clearCountry');
    await this.$api2.transientRequest2(
      queries.set_current_country(country.id),
    );
    await app.session.fetchUser({
      api2: this.$api2,
      store: this.$store,
    });
  }
}
</script>
