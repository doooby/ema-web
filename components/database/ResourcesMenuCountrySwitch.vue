<template>
  <div v-if="viableCountries.length > 0">
    <form-group
      :value="{ country: currentCountryId }"
      :fields="fields"
      @input="onSelectCountry"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { SessionUser } from '~/lib/records';
import { buildFormFields, FormField } from '~/components/Form';
import * as mappers from '~/lib/api/mappers';

@Component
export default class ResourcesMenuCountrySwitch extends Vue {
  get viableCountries (): mappers.AssociatedRecord[] {
    const user: SessionUser = this.$store.state.session.currentUser;
    return user?.countries ?? [];
  }

  get currentCountryId (): null | number {
    const country = this.$store.state.session.currentCountry;
    return country ? country.id : null;
  }

  get fields (): FormField[] {
    const label = this.$t('db.menu.switch_country');
    const options = this.viableCountries.map(country => ({
      value: country.id,
      caption: country.caption,
    }));
    return buildFormFields([
      [ 'country', 'list', { label, options } ],
    ]);
  }

  onSelectCountry (value: any): void {
    const { country: countryId } = value;
    const country = this.viableCountries.find(item => item.id === countryId);
    this.$store.commit('session/setCurrentCountry', country ?? null);
  }
}
</script>
