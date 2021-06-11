<template>
  <div class="emt-5">
    <h2 class="text-capitalize">
      {{ $t(`record.${resource.name}.meta.p`) }}
    </h2>
    <ul>
      <li
        v-for="page in pages"
        :key="page"
      >
        <nuxt-link :to="page.path">
          {{ page.text }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Resource, resourcePath } from '~/config/pages';
import VueI18n from 'vue-i18n';

export default Vue.extend({
  props: {
    resource: {
      type: Object as PropType<Resource>,
      required: true,
    },
  },
  computed: {
    pages (): { text: VueI18n.TranslateResult, path: string }[] {
      const { name, pages } = this.resource;
      return pages.map(page => ({
        text: this.$t(`db.pages.${page}`),
        path: resourcePath(name, page),
      }));
    },
  },
});
</script>
