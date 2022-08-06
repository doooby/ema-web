<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <ul>
      <li v-for="(level, index) in system.levels" :key="index">
        <small class="emb-2">{{ level.name }} ({{ level.name_en }})</small>
        <br>
        <select-with-modal
          v-if="level.type === 'list'"
          :value="values[index]"
          :disabled="index !== 0 && !values[index - 1]"
          :options-source="levelsSources[index]"
          @select="onLocationSelected(index, $event)"
        >
          <template #modal-title>
            <t :value="labelTranslation" />
          </template>
        </select-with-modal>
        <div v-if="level.type === 'text'">
          input
        </div>
      </li>
      inputs
    </ul>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { LocationSystem } from '~/lib/records';
import SelectWithModal, { OptionsSource } from '~/components/Form/primitives/SelectWithModal.vue';
import { MaybeData, Option } from '~/lib/types';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectWithModal },
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
    return this.field.options.system ?? { id: -1, levels: [] };
  }

  get levelsSources (): OptionsSource[] {
    const levels = this.system?.levels;
    if (!levels) return [];
    return levels.map((level, index) => {
      if (level.type === 'list') {
        return {
          fetch: () => {
            return this.onFetchOptions(index + 1);
          },
        };
      } else return { list: [] };
    });
  }

  onLocationSelected (index: number, value: string) {
    const newValues = [ ...this.values ];
    newValues[index] = value;
    newValues.length = index + 1;
    this.context.onChange({ [this.field.name]: newValues });
  }

  async onFetchOptions (level: number): Promise<MaybeData<Option[]>> {
    const fetchLocations = this.field.options.fetchLocations;
    if (!fetchLocations) return Promise.resolve({ ok: false });
    const parent_index = this.getParentListLevelIndex(level);
    const parent_id = parent_index === null ? undefined : this.values[parent_index];
    const result = await fetchLocations(level, parent_id);
    if (result.ok) {
      return {
        ok: true,
        data: result.data.map(location => ({
          value: location.id,
          text: location.name,
        })),
      };
    } else {
      return result;
    }
  }

  getParentListLevelIndex (fromLevel: number): null | number {
    if (!this.system?.levels) return null;
    for (let i = fromLevel - 2; i > -1; i -= 1) {
      const source = this.system.levels[i];
      if (source.type === 'list') return i;
    }
    return null;
  }
}
</script>
