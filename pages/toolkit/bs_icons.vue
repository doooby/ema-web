<template>
  <div class="container-fluid my-4 d-flex flex-wrap">
    <div
      v-for="icon of Object.keys(icons)"
      :key="icon"
      class="mx-3 mb-3 d-flex flex-column align-items-center"
    >
      <div style="font-size: 3rem;">
        <icon-component :component="icons[icon]" />
      </div>
      <small class="text-monospace text-muted">{{ icon }}</small>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as icons from 'bootstrap-vue/src/icons/icons';

const IconComponent = Vue.extend({
  functional: true,
  props: {
    component: { type: Object, required: true },
  },
  render (createElement, { props }): Vue.VNode {
    return createElement(props.component, {
      class: 'border rounded p-2',
    });
  },
});

@Component({
  components: { IconComponent },
})
export default class BsIcons extends Vue {
  icons = icons;
}
</script>
