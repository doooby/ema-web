<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';

@Component
export default class EditPersonFields extends Vue {
  @Prop({ required: true }) pageState!: app.page.State;

  options = new app.internals.Options();
  controls = controls.Group.new(
    'name',
  );

  @Watch('controls.state.params')
  onParamsChanged () {
    this.$emit('change', this.controls.state.params);
  }
}
</script>

<template>
  <div />
</template>
