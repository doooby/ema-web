<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

export interface Label {
  variant: string;
  text: string;
}

@Component
export default class RecordLabels extends Vue {
    @Prop() labels?: app.SparseList<Label>;

    get presentLabels () {
      if (!this.labels?.length) return;
      return this.labels.filter(self => self) as Label[];
    }
}
</script>

<template>
  <div>
    <div
      v-if="presentLabels"
      :class="[
        'd-flex',
        $attrs.class,
      ]"
      style="gap: 8px;"
    >
      <t
        v-for="({ variant, text }, index) in presentLabels"
        :key="index"
        :value="text"
        :class="`badge badge-${variant}`"
      />
    </div>
  </div>
</template>
