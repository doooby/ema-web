<template>
  <div class="page-menu ep-3">
    <nuxt-link to="/database">
      <t value="db.menu.index_page" />
    </nuxt-link>
    <country-switch />
    <hr>
    <current-resource
      v-if="currentResource"
      :resource="currentResource"
    />
    <hr>
    <resources-listing />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CountrySwitch from '~/components/database/ResourcesMenuCountrySwitch.vue';
import CurrentResource from '~/components/database/ResourcesMenuCurrent.vue';
import ResourcesListing from '~/components/database/ResourcesMenuResourcesListing.vue';
import { dbPages, Resource } from '~/config/pages';

@Component({
  components: { CountrySwitch, CurrentResource, ResourcesListing },
})
export default class ResourcesMenu extends Vue {
  get currentResource (): undefined | Resource {
    const name = this.$route.path.match(/^\/database\/(\w+)\/?.*/)?.[1];
    const resource = name && dbPages.find(item => item.name === name);
    return resource || undefined;
  }
}
</script>
