<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class ButtonToModal extends Vue {
  modalShown = app.createRef(false);
}
</script>

<template>
  <button
    type="button"
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    @click="modalShown.ref = true"
  >
    <slot :shown="modalShown" />
  </button>
</template>
