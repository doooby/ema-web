<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BRecord } from '~/lib/api2';

@Component
export default class SubjectColumnHeader extends Vue {
  @Prop({ required: true }) readonly subject!: BRecord;
}
</script>

<template>
  <div>
    <span v-if="subject.name">{{ subject.name }}</span>
    <br v-if="subject.name">
    <span
      class="text-muted font-12"
    >{{ subject.caption }}</span>
  </div>
</template>
