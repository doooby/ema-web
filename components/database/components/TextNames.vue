<template>
  <div :class="className">
    <span v-if="value[1]">{{ value[1] }}</span>
    <br v-if="value[0] && value[1]" />
    <small v-if="value[0]">{{ value[0] }}</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextNames extends Vue {
  @Prop({ required: true }) readonly value!: string[];
  @Prop({ default: false }) readonly className?: string;
}
</script>
