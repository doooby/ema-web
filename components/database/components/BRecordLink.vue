<script lang="ts">
import Vue from 'vue';
import { BRecord } from '~/lib/api2';
import { Component, Prop } from 'vue-property-decorator';
import { entitiesWithShowPage } from '~/config/pages';

@Component({
})
export default class BRecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: BRecord;
  @Prop({ default: false }) readonly newTab!: boolean;
  @Prop({ default: false }) readonly showId!: boolean;

  get hasShowPage () {
    return entitiesWithShowPage.includes(this.entity);
  }

  get path () {
    return `/database/${this.entity}/${this.record.id}`;
  }

  get fullPath () {
    let base = this.$router.options.base;
    if (base?.endsWith('/')) base = base.substring(0, base.length - 1);
    return `${base}${this.path}`;
  }
}
</script>

<template>
  <div class="d-inline-block db--b-record-link">
    <code v-if="!hasShowPage">
      [{{ record.id }}]&nbsp;{{ record.caption }}
    </code>
    <nuxt-link v-else-if="!newTab" :to="path" class="icon-link">
      <b-icon icon="card-heading" />&nbsp;{{ showId ? record.id : record.caption }}
    </nuxt-link>
    <a v-else :href="fullPath" target="_blank" class="icon-link" @click.stop>
      <b-icon icon="card-heading" />&nbsp;{{ showId ? record.id : record.caption }}
    </a>
  </div>
</template>
