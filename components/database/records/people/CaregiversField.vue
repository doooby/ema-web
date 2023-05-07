<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <items-listing
      :columns="columns"
      :items="items"
      @add="onAddItem"
      @change="onChangeValue"
    >
      <template #header-relation>
        <t value="db.record.people.caregivers.label.relation" />
      </template>
      <template #header-name>
        <t value="lexicon.name" />
      </template>
      <template #header-details>
        <t value="db.record.people.caregivers.label.details" />
      </template>
      <template #header-cash_for_work>
        <t value="db.record.people.caregivers.label.cash_for_work" />
      </template>
      <template #cell-relation="{ index, item }">
        <select-or-fill-input
          :value="item.relation"
          :options="relationOptions"
          @input="onUpdateItem(index, item, 'relation', $event)"
        />
      </template>
      <template #cell-name="{ index, item }">
        <b-form-group>
          <template #label>
            <t value="lexicon.first_name" />
          </template>
          <name-input
            :value="item.first_name"
            @input="onUpdateItem(index, item, 'first_name', $event)"
          />
        </b-form-group>
        <b-form-group>
          <template #label>
            <t value="lexicon.last_name" />
          </template>
          <name-input
            :value="item.last_name"
            @input="onUpdateItem(index, item, 'last_name', $event)"
          />
        </b-form-group>
      </template>
      <template #cell-details="{ index, item }">
        <b-form-group>
          <template #label>
            <t value="lexicon.citizen_id" />
          </template>
          <text-input
            :value="item.citizen_id"
            @input="onUpdateItem(index, item, 'citizen_id', $event)"
          />
        </b-form-group>
        <b-form-group>
          <template #label>
            <t value="lexicon.phone_no" />
          </template>
          <text-input
            :value="item.phone_no"
            @input="onUpdateItem(index, item, 'phone_no', $event)"
          />
        </b-form-group>
        <b-form-group>
          <template #label>
            <t value="lexicon.email" />
          </template>
          <text-input
            :value="item.email"
            @input="onUpdateItem(index, item, 'email', $event)"
          />
        </b-form-group>
      </template>
      <template #cell-cash_for_work="{ index, item }">
        <b-form-group>
          <template #label>
            <t value="db.record.people.label.cash_for_work" />
          </template>
          <text-input
            :value="item.cash_for_work"
            @input="onUpdateItem(index, item, 'cash_for_work', $event)"
          />
        </b-form-group>
        <b-form-group>
          <template #label>
            <t value="db.record.people.label.humansis_cfw_id" />
          </template>
          <text-input
            :value="item.humansis_cfw_id"
            @input="onUpdateItem(index, item, 'humansis_cfw_id', $event)"
          />
        </b-form-group>
      </template>
    </items-listing>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { common, person } from '~/lib/records';
import SelectInput from '~/components/Form/primitives/SelectInput.vue';
import NameInput from '~/components/Form/primitives/NameInput.vue';
import TextInput from '~/components/Form/primitives/TextInput.vue';
import SelectOrFillInput from '~/components/Form/primitives/SelectOrFillInput.vue';
import app from '~/lib/app';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectOrFillInput, SelectInput, NameInput, TextInput },
})
export default class CaregiversField extends Vue {
  static fieldType: FormFieldType = {};

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  columns = [
    { name: 'relation' },
    { name: 'name', size: 250 },
    { name: 'details' },
    { name: 'cash_for_work' },
  ];

  get items (): person.PersonCaregiver[] {
    return (this as any).rawValue ?? [];
  }

  get relationOptions (): app.Option[] {
    return this.field.options.relationOptions ?? [];
  }

  onAddItem () {
    const newItems = [ ...this.items ];
    newItems.push(
      Object.freeze({ relation: [ 'mother', undefined ] }) as any,
    );
    Object.freeze(newItems);
    (this as any).onChangeValue(newItems);
  }

  onUpdateItem (
    index: number,
    item: person.PersonCaregiver,
    field: string,
    value: any,
  ) {
    const newItems = [ ...this.items ];
    newItems[index] = Object.freeze({
      ...item,
      [field]: value,
    });
    Object.freeze(newItems);
    (this as any).onChangeValue(newItems);
  }
}
</script>
