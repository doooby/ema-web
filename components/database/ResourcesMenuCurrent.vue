<template>
  <div class="emt-5">
    <h2 class="text-capitalize">
      <t :value="`db.menu.resource.${resource.name}`" />
    </h2>
    <ul>
      <li
        v-for="page in pages"
        :key="page.name"
      >
        <nuxt-link :to="page.path">
          <t :value="page.text" />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Resource, resourcePath } from '~/config/pages';

@Component
export default class ResourcesMenuCurrent extends Vue {
  @Prop({ required: true }) readonly resource!: Resource;

  get pages (): Array<{ name: string, text: string, path: string }> {
    const { name, pages } = this.resource;
    return pages.map(page => ({
      name: page,
      text: `db.page.${page || 'index'}.action`,
      path: resourcePath(name, page),
    }));
  }
}
</script>
