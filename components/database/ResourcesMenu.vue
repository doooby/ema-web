<template>
  <div class="page-menu ep-3">
    <nuxt-link to="/database">
      <t value="db.menu.index_page" />
    </nuxt-link>
    <div v-if="countryData" class="mt-2">
      <h4>{{ countryData.record.caption }}</h4>
      <h6>{{ countryData.record.name }}</h6>
      <country-switch />
    </div>
    <div v-else>
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <hr>
    <resources-listing />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CountrySwitch from '~/components/database/ResourcesMenuCountrySwitch.vue';
import ResourcesListing from '~/components/database/ResourcesMenuResourcesListing.vue';

@Component({
  components: { CountrySwitch, ResourcesListing },
})
export default class ResourcesMenu extends Vue {
  get user () {
    return this.$store.state.session.user;
  }

  get countryData () {
    return this.$store.state.session.country;
  }
}
</script>
