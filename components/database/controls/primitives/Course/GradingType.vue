<template>
  <ul class="list-unstyled">
    <li class="emb-1">
      <div class="d-flex">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <t value="app.common.label.min" />
            </span>
          </div>
          <input
            :id="domId && `${domId}_min`"
            type="text"
            class="form-control"
            maxlength="2"
            :value="sanitizedValue[0]"
            autocomplete="off"
            @blur="onInput(0, $event)"
          >
        </div>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <t value="app.common.label.max" />
            </span>
          </div>
          <input
            :id="domId && `${domId}_max`"
            type="text"
            class="form-control"
            maxlength="2"
            :value="sanitizedValue[1]"
            autocomplete="off"
            @blur="onInput(1, $event)"
          >
        </div>
      </div>
    </li>

    <li>
      <div class="d-flex align-items-center">
        <checkbox-input
          class="mr-2"
          :value="sanitizedValue[2] !== undefined"
          @change="onLimitCheckChange"
        >
          <t value="app.common.label.required" />
        </checkbox-input>
        <input
          :id="domId && `${domId}_limit`"
          type="text"
          class="form-control"
          maxlength="2"
          :disabled="sanitizedValue[2] === undefined"
          :value="sanitizedValue[2]"
          autocomplete="off"
          @blur="onInput(2, $event)"
        >
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';

@Component({
  components: { CheckboxInput },
})
export default class GradingType extends Vue {
  @Prop() domId?: string;
  @Prop({ required: true }) value!: any;

  get sanitizedValue (): [string, string, undefined | string] {
    const { value } = this;
    if (Array.isArray(value)) {
      return [
        value[0],
        value[1],
        value[2],
      ];
    } else {
      return [ '', '', undefined ];
    }
  }

  onInput (index: number, event: {target: HTMLInputElement}): void {
    const newValue = [ ...this.sanitizedValue ];
    newValue[index] = event.target.value;
    this.$emit('change', newValue);
  }

  onLimitCheckChange (check: boolean) {
    const newValue = [ ...this.sanitizedValue ];
    newValue[2] = check ? '' : undefined;
    this.$emit('change', newValue);
  }
}
</script>
