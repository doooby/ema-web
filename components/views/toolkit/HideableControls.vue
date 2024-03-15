<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class HideableControls extends Vue {
  @Prop({ required: true }) readonly name!: string;
  @Prop() readonly showText?: string;
  @Prop() readonly hideText?: string;
  @Prop() readonly show?: boolean;

  shown = false;

  created () {
    if (this.show) this.shown = true;
  }

  get collapseId () {
    return `collapse__${this.name}`;
  }

  get toggleButtonTexts (): {
    show: string;
    hide: string;
    } {
    return {
      show: this.showText ?? 'toolkit.HideableControls.toogle.show',
      hide: this.hideText ?? 'toolkit.HideableControls.toogle.hide',
    };
  }
}
</script>

<template>
  <div :class="['border pt-3 px-3', $attrs.class]">
    <div
      class="d-flex flex-wrap"
      :style="{ gap: '16px', marginBottom: '16px' }"
    >
      <slot name="main-row" />
      <b-button
        v-b-toggle="collapseId"
        size="sm"
        variant="outline-secondary"
      >
        <b-icon
          :icon="shown ? 'chevron-up' : 'chevron-down'"
          class="mr-1"
        />
        <t v-if="shown" :value="toggleButtonTexts.hide" />
        <t v-else :value="toggleButtonTexts.show" />
      </b-button>
    </div>
    <b-collapse
      :id="collapseId"
      v-model="shown"
    >
      <div class="row">
        <slot />
      </div>
    </b-collapse>
  </div>
</template>
