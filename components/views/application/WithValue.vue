<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class WithValue extends Vue {
    @Prop() value?: any;
}
</script>

<template>
  <div>
    <slot v-if="value" :value="value" />
  </div>
</template>
