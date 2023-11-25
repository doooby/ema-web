<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class RecordName extends Vue {
  @Prop({ required: true }) readonly names!: app.Maybe<app.List<string>>;
}
</script>

<template>
  <div :class="$attrs.class">
    <div>
      {{ names?.[1] }}
    </div>
    <div class="font-14">
      {{ names?.[0] }}
    </div>
  </div>
</template>
