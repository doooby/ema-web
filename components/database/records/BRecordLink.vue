<script lang="ts">
import Vue from 'vue';
import { BRecord } from '~/lib/api2';

const entitiesWithShowPage = [
  'people',
];

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    record: { type: Object as Vue.PropType<BRecord>, required: true },
    newTab: { type: Boolean, default: false },
  },
  computed: {
    hasShowPage () {
      return entitiesWithShowPage.includes(this.entity);
    },
    path () {
      return `/database/${this.entity}/${this.record.id}`;
    },
    fullPath () {
      let base = this.$router.options.base;
      if (base?.endsWith('/')) base = base.substring(0, base.length - 1);
      return `${base}${this.path}`;
    },
  },
});
</script>

<template>
  <div class="d-inline">
    <code v-if="!hasShowPage">
      [{{ record.id }}] {{ record.caption }}
    </code>
    <nuxt-link v-if="!newTab" :to="path">
      <b-icon icon="card-heading" variant="primary" />
      {{ record.caption }}
    </nuxt-link>
    <a v-else :href="fullPath" target="_blank" @click.stop>
      <b-icon icon="card-heading" variant="primary" />
      {{ record.caption }}
    </a>
  </div>
</template>
