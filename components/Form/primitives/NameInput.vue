<template>
  <div>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.en" />
        </span>
      </div>
      <input
        :id="domId"
        type="text"
        class="form-control"
        :value="sanitizedValue[0]"
        autocomplete="off"
        @blur="onInputEn"
      >
    </div>

    <div class="input-group emt-1">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.local" />
        </span>
      </div>
      <input
        :id="`${domId}_local`"
        type="text"
        class="form-control"
        :value="sanitizedValue[1]"
        autocomplete="off"
        @blur="onInputLoc"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class NameInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any;

  get sanitizedValue () {
    if (!Array.isArray(this.value)) return [];
    else return this.value;
  }

  onInputEn (event) {
    const newValue = [ event.target.value, this.sanitizedValue[1] ];
    this.$emit('input', newValue);
  }

  onInputLoc (event) {
    const newValue = [ this.sanitizedValue[0], event.target.value ];
    this.$emit('input', newValue);
  }
}
</script>
