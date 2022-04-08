<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="d-flex" @click="onChevronClick">
      <div class="flex-fill text-truncate association--text">
        {{ valueText }}
      </div>
      <b-button v-if="selectedRecord" variant="secondary" @click.stop="onClear">
        <b-icon icon="x" />
      </b-button>
      <b-button variant="secondary">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal
      v-model="modalShown"
      hide-footer
    >
      <template #modal-title>
        <t :value="labelTranslation" />
      </template>
      <search-modal
        v-if="modalShown"
        :fetch-query="fetchQuery"
        :fetch-params="field.options.params"
        :selected-id="selectedRecord && selectedRecord.id"
        @select="onItemSelected"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import SearchModal from './SearchModal.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { SearchModal },
})
export default class AssociatedRecord extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      params[options.paramsName || `${name}_id`] = values[name]?.id;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  modalShown = false;

  get selectedRecord (): undefined | any {
    return this.formValues[this.field.name] ?? undefined;
  }

  get valueText (): string {
    const value = this.selectedRecord;
    return value ? value.labels.caption : '';
  }

  get fetchQuery (): any {
    const entity = this.field.options.entity;
    const query = entity && (this.$api.queries as any)[entity]?.searchAssociated;
    if (query) return query;

    utils.raise(new Error(`database.controls.AssociatedRecord: query not found for entity ${entity}`));
    return null;
  }

  onChevronClick () {
    this.modalShown = true;
  }

  onItemSelected (record: any) {
    this.modalShown = false;
    this.context.onChange({ [this.field.name]: record });
  }

  onClear () {
    this.context.onChange({ [this.field.name]: undefined });
  }
}
</script>
