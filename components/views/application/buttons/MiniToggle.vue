<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MiniToggle extends Vue {
    @Prop({ required: true }) value!: boolean;
    @Prop() text?: string;
}
</script>

<template>
  <button
    :class="[
      'btn btn-xs btn-link d-flex align-items-center font-14',
      $attrs.class,
      value ? 'text-body' : 'text-secondary',
    ]"
    type="button"
    @click="$emit('click', !value)"
  >
    <b-icon
      class="mr-1"
      :icon="value ? 'record-circle' : 'circle'"
    />
    <slot :isOn="!!value" />
    <t
      v-if="text"
      :value="text"
    />
  </button>
</template>
