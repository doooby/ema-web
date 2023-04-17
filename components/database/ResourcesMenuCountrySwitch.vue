<template>
  <div>
    <div v-if="viableCountries.length > 1">
      <form-group
        :value="{ country: currentCountryId }"
        :fields="fields"
        name-prefix="resources_menu"
        @input="onSelectCountry"
      />
    </div>
    <div v-if="viableCountries.length === 1">
      {{ viableCountries[0].caption }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { user2 } from '~/lib/records';
import { buildFormFields, FormField } from '~/components/Form';
import * as mappers from '~/lib/api/mappers';

@Component
export default class ResourcesMenuCountrySwitch extends Vue {
  get viableCountries (): mappers.AssociatedRecord[] {
    const currentUser: user2.SessionUser = this.$store.state.session.currentUser;
    return currentUser?.countries ?? [];
  }

  get currentCountryId (): null | number {
    return this.$store.getters['session/countryId'];
  }

  get fields (): FormField[] {
    const label = this.$t('db.menu.switch_country');
    const options = this.viableCountries.map(country => ({
      value: country.id,
      text: country.labels.caption,
    }));
    return buildFormFields([
      [ 'country', 'list', { label, options } ],
    ]);
  }

  onSelectCountry (value: any): void {
    const { country: countryId } = value;
    const country = this.viableCountries.find(item => item.id === countryId);
    this.$store.dispatch('session/switchCountry', {
      country: country ?? null,
      api: this.$api,
    });
  }
}
</script>
