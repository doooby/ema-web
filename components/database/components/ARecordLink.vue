<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { entitiesWithShowPage } from '~/config/pages';

@Component({
})
export default class ARecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly id!: string;
  @Prop({ default: false }) readonly newTab!: boolean;

  get hasShowPage () {
    return entitiesWithShowPage.includes(this.entity);
  }

  get path () {
    return `/database/${this.entity}/${this.id}`;
  }

  get fullPath () {
    let base = this.$router.options.base;
    if (base?.endsWith('/')) base = base.substring(0, base.length - 1);
    return `${base}${this.path}`;
  }
}
</script>

<template>
  <div class="d-inline db--b-record-link text-truncate">
    <code v-if="!hasShowPage">
      [{{ id }}]
    </code>
    <nuxt-link v-else-if="!newTab" :to="path" class="icon-link">
      <b-icon icon="card-heading" />
      {{ id }}
    </nuxt-link>
    <a v-else :href="fullPath" target="_blank" class="icon-link" @click.stop>
      <b-icon icon="card-heading" />
      {{ id }}
    </a>
  </div>
</template>
