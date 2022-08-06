<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <ul>
      <li v-for="(level, index) in levelDefinitions" :key="index">
        <location-row
          :definition="level"
          :value="values[level.levelIndex]"
          :parent-location-id="values[level.parentListLevelIndex]"
          :disabled="level.levelIndex !== 0 && !values[level.levelIndex - 1]"
          @change="onValueChange"
        />
      </li>
    </ul>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { LocationSystem } from '~/lib/records';
import LocationRow, { Definition } from '~/components/Form/controls/Location/LocationRow.vue';

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

  get system (): LocationSystem {
    return this.field.options.system ?? { id: -1, levels: [] };
  }

  get levelDefinitions (): Definition[] {
    const fetchLocations = this.field.options.fetchLocations ??
      (() => Promise.resolve({ ok: false }));
    return this.system.levels.map((level, index) => {
      return {
        levelIndex: index,
        level,
        parentListLevelIndex: this.getParentListLevelIndex(index),
        fetchLocations,
      };
    });
  }

  onValueChange ({ index, value }: {index: number, value: string}) {
    const newValues = [ ...this.values ];
    newValues[index] = value;
    newValues.length = index + 1;
    this.context.onChange({ [this.field.name]: newValues });
  }

  getParentListLevelIndex (fromIndex: number): null | number {
    for (let i = fromIndex - 1; i > -1; i -= 1) {
      const source = this.system.levels[i];
      if (source.type === 'list') return i;
    }
    return null;
  }
}
</script>
