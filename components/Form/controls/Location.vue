<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <ul>
      <li v-for="(level, index) in levelDefinitions" :key="index">
        <location-row
          :level="level"
          :parent-value="values[index - 1]"
          :value="values[index]"
          :disabled="index !== 0 && !values[index - 1]"
          :fetch-locations="() => onFetchLocations(index)"
          @change="onChangeLocation(index, $event)"
        />
      </li>
    </ul>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { LocationSystem, LocationSystemLevel } from '~/lib/records';
import LocationRow from '~/components/Form/controls/Location/LocationRow.vue';
import { MaybeData } from '~/lib/types';

@Component({
  mixins: [ ControlMixin ],
  components: { LocationRow },
})
export default class Location extends Vue {
  static fieldType: FormFieldType = {
    name: 'location',
    fillParams ({ name }, values, record) {
      record[name] = values[name];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get values (): string[] {
    const value = this.formValues[this.field.name];
    if (!Array.isArray(value)) return [];
    else return value;
  }

  get system (): undefined | LocationSystem {
    return this.field.options.system;
  }

  get levelDefinitions (): LocationSystemLevel[] {
    const list: LocationSystemLevel[] = [];
    if (!this.system) return list;
    for (let i = 0; i < this.system.levels; i += 1) {
      const level = this.system.settings?.[i + 1];
      if (!level) break;
      list.push(level);
    }
    return list;
  }

  onFetchLocations (index: number): Promise<MaybeData<Location[]>> {
    const fetchLocations = this.field.options.fetchLocations;
    if (!fetchLocations || !this.system) return Promise.resolve({ ok: false });
    return fetchLocations(index === 0 ? undefined : this.values[index - 1]);
  }

  onChangeLocation (index: number, value: string) {
    const newValues = [ ...this.values ];
    newValues[index] = value;
    newValues.length = index + 1;
    (this as any).onChangeValue(Object.freeze(newValues));
  }
}
</script>
