<script lang="ts">
import Vue from 'vue';
import { BRecord } from '~/lib/api2';
import { Component, Prop } from 'vue-property-decorator';

const entitiesWithShowPage = [
  'people',
];

@Component({
  components: { BRecordLink },
})
export default class BRecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: BRecord;
  @Prop({ default: false }) readonly newTab!: boolean;

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
