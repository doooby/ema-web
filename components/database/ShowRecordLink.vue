<template>
  <div class="d-inline">
    <nuxt-link v-if="!inNewTab" :to="path">
      <b-icon icon="card-heading" variant="primary" />
      {{ record.caption }}
    </nuxt-link>
    <a v-else :href="fullPath" target="_blank" @click.stop>
      <b-icon icon="card-heading" variant="primary" />
      {{ record.caption }}
    </a>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ShowRecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: { id: number, caption: string };
  @Prop({ default: () => false }) readonly inNewTab?: boolean;

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
