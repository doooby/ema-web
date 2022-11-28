<template>
  <div class="d-inline">
    <nuxt-link v-if="!inNewTab" :to="path">
      <b-icon icon="card-heading" variant="primary" />
      {{ record.labels.caption }}
    </nuxt-link>
    <a v-else :href="fullPath" target="_blank" @click.stop>
      <b-icon icon="card-heading" variant="primary" />
      {{ record.labels.caption }}
    </a>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as mappers from '~/lib/api/mappers';

@Component
export default class LinkAbbreviatedRecord extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: mappers.AbbreviatedRecord;
  @Prop({ default: false }) readonly inNewTab?: boolean;

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
