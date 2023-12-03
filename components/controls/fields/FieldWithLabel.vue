<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';

@Component({
})
export default class FieldWithLabel extends Vue {
  @Prop({ required: true }) readonly controls!: controls.Group;
  @Prop({ required: true }) readonly name!: string;
  @Prop() readonly label?: string;
  @Prop() readonly controlDomId?: string;

  get value (): any {
    return this.controls.getValue(this.name);
  }

  onChange (value) {
    this.controls.update(this.name, value);
  }
}
</script>

<template>
  <b-form-group
    :class="$attrs.class"
    :label-for="controlDomId"
  >
    <template v-if="label" #label>
      <t :value="label" />
    </template>
    <template #default="{ labelId }">
      <slot
        :value="value"
        :dom-id="labelId"
        :on-change="onChange"
      />
    </template>
  </b-form-group>
</template>
