<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class ButtonToAction extends Vue {
  @Prop({ required: true }) newPage!: string;
  @Prop() data?: app.Map<any>;

  onClick () {
    this.$store.dispatch('action/goToActionPage', {
      context: this,
      newPage: this.newPage,
      data: this.data ?? {},
    });
  }
}
</script>

<template>
  <button
    type="button"
    :class="[ 'btn d-flex align-items-center' , $attrs.class ]"
    @click="onClick"
  >
    <slot />
  </button>
</template>
