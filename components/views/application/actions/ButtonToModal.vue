<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class ButtonToModal extends Vue {
  @Prop() readonly icon?: string;
  @Prop({ default: 'mr-2' }) readonly iconClass?: string;

  modalShown = app.createRef(false);
}
</script>

<template>
  <button
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    @click="modalShown.ref = true"
  >
    <b-icon v-if="icon" :icon="icon" :class="iconClass" />
    <slot :shown="modalShown" />
  </button>
</template>
