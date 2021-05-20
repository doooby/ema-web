<template>
  <div class="page-menu">
    <nuxt-link class="my-3" to="/database">
      Index
    </nuxt-link>
    <div v-if="resource">
      <h2>
        {{ resource.name }}
      </h2>
      <ul>
        <li
          v-for="page in resource.pages"
          :key="page.name"
        >
          <nuxt-link :to="`/database/${resource.name}/${page.name}`">
            {{ page.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface Resource {
  name: string;
  pages: Array<{
    name: string;
  }>;
}

export default Vue.extend({
  computed: {
    resource (): undefined | Resource {
      const name = this.$route.path.match(/^\/database\/(\w+)\/?.*/)?.[1];
      const resource = name && resources.find(item => item.name === name);
      return resource || undefined;
    },
  },
});

const resources: Resource[] = [
  {
    name: 'users',
    pages: [
      { name: 'browse' },
      { name: 'new' },
    ],
  },
];
</script>
