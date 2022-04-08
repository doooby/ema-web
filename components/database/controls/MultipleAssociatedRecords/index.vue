<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div v-if="selectedCategories.length" class="association--text">
      <div
        v-for="category of selectedCategories"
        :key="category.id"
        class="d-flex align-items-center"
      >
        <span class="emr-2">
          {{ category.labels.caption }}
        </span>
        <b-button variant="outline-secondary" class="btn-xs" @click="onRemoveItem(category)">
          <b-icon icon="x" />
        </b-button>
      </div>
    </div>
    <div>
      <b-button
        variant="outline-primary"
        class="btn-xs"
        @click="modalShown = true"
      >
        <b-icon icon="plus" />
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
        @select="onAddCategory"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import SearchModal from '../AssociatedRecord/SearchModal.vue';
import { AssociatedRecord } from '~/lib/api/mappers';
import { SubjectCategory } from '~/lib/records';

@Component({
  mixins: [ ControlMixin ],
  components: { SearchModal },
})
export default class MultipleAssociatedRecords extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      params[options.paramsName || `${name}_ids`] = values[name]?.map(({ id }: any) => id);
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  modalShown = false;

  get selectedCategories (): AssociatedRecord<SubjectCategory>[] {
    return this.formValues[this.field.name] ?? [];
  }

  get fetchQuery (): any {
    const entity = this.field.options.entity;
    const query = entity && (this.$api.queries as any)[entity]?.searchAssociated;
    if (query) return query;

    utils.raise(new Error(`database.controls.MultipleAssociatedRecords: query not found for entity ${entity}`));
    return null;
  }

  onAddCategory (category: AssociatedRecord<SubjectCategory>) {
    this.modalShown = false;
    if (this.selectedCategories.find(({ id }) => id === category.id)) return;
    const newCategories = [ ...this.selectedCategories, category ];
    this.context.onChange({ [this.field.name]: newCategories });
  }

  onRemoveItem (category: AssociatedRecord<SubjectCategory>) {
    const newCategories = this.selectedCategories.filter(({ id }) => id !== category.id);
    this.context.onChange({ [this.field.name]: newCategories });
  }
}
</script>
