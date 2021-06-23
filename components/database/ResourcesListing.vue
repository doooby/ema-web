<template>
  <div class="emt-8">
    <b-form-group>
      <input
        id="db-resource-search"
        v-model="searchValue"
        type="text"
        class="form-control"
        :placeholder="placeholderText"
      >
    </b-form-group>
    <ul class="list-unstyled">
      <li
        v-for="resource in shownResources"
        :key="resource.name"
        class=""
      >
        <nuxt-link :to="resource.path">
          {{ resource.name }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { dbPages, resourcePath } from '~/config/pages';
import VueI18n from 'vue-i18n';

export default Vue.extend({
  data () {
    return {
      searchValue: '' as string,
    };
  },
  computed: {
    placeholderText (): VueI18n.TranslateResult {
      return this.$t('db.menu.search_placeholder');
    },
    shownResources (): { name: VueI18n.TranslateResult, path: string }[] {
      const term = this.searchValue.trim().toLowerCase();
      let hits = dbPages.filter(resource => resource.name.includes(term));
      hits = hits.sort((a, b) => a.name.localeCompare(b.name));
      return hits.map(resource => ({
        name: this.$t(`record.${resource.name}.meta.p`),
        path: resourcePath(resource.name, resource.pages[0]),
      }));
    },
  },
});
</script>
