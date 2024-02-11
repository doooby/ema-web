<template>
  <div :class="$attrs.class">
    <slot name="prepend" />
    <span v-if="text_local">{{ text_local }}</span>

    <span v-if="text_local && text_en && inline"> / </span>
    <br v-if="text_local && text_en && !inline">

    <small v-if="text_en">{{ text_en }}</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class TextNames extends Vue {
  @Prop({ default: undefined }) readonly value!: app.Maybe<string[]>;
  @Prop() readonly inline?: boolean;

  get text_en () {
    return this.value?.[0];
  }

  get text_local () {
    return this.value?.[1];
  }
}
</script>
