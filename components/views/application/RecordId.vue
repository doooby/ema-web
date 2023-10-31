<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';

@Component
export default class RecordId extends Vue {
  @Prop({ required: true }) readonly record!: wai.AResource;
  @Prop() readonly showLink?: string;
  @Prop() readonly newTab?: boolean;

  get fullPath () {
    let base = this.$router.options.base;
    if (base?.endsWith('/')) base = base.substring(0, base.length - 1);
    return `${base}${this.showLink}`;
  }
}
</script>

<template>
  <div
    :class="[ $attrs.class, 'p-1 d-flex align-items-center border' ]"
  >

    <code class="mr-1">
      [ {{ record.id }} ]
    </code>

    <div v-if="showLink">
      <nuxt-link
        v-if="!newTab"
        :to="showLink"
        class="p-1 icon-link"
      >
        <b-icon icon="card-heading" />&nbsp;{{ record.caption }}
      </nuxt-link>
      <a
        v-else
        :href="fullPath"
        target="_blank"
        class="p-1 icon-link"
        @click.stop
      >
        <b-icon icon="card-heading" />&nbsp;{{ record.caption }}
      </a>
    </div>

    <span v-else>
      {{ record.caption }}
    </span>

  </div>
</template>
