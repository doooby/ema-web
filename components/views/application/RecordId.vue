<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';

@Component
export default class RecordId extends Vue {
  @Prop({ required: true }) readonly record!: wai.AResource;
  @Prop() readonly path?: string;
  @Prop() readonly newTab?: boolean;

  get fullPath () {
    let base = this.$router.options.base;
    if (base?.endsWith('/')) base = base.substring(0, base.length - 1);
    return `${base}${this.path}`;
  }
}
</script>

<template>
  <div :class="[ $attrs.class, 'lh-1_25' ]">

    <code>
      [&nbsp;{{ record.id }}&nbsp;]
    </code>

    <span v-if="path">
      <nuxt-link
        v-if="!newTab"
        :to="path"
        class="p-1 icon-link"
      >
        <b-icon icon="card-heading" />
        {{ record.caption }}
      </nuxt-link>
      <a
        v-else
        :href="fullPath"
        target="_blank"
        class="p-1 icon-link"
        @click.stop
      >
        <b-icon icon="card-heading" />
        {{ record.caption }}
      </a>
    </span>

    <span v-else>
      {{ record.caption }}
    </span>

  </div>
</template>
