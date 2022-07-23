<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <items-listing-view :columns="columns" :items="items" @add="onAdd" @change="onChange">
      <template #cell-type="{ index, item }">
        <b-form-select
          :value="item.type"
          :options="privilegesTypesOptions"
          @input="onSelectTypeFor(index, $event)"
        />
      </template>
    </items-listing-view>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import { UserPrivilege } from '~/lib/records';

@Component({
  mixins: [ ControlMixin ],
})
export default class Privileges extends Vue {
  static fieldType: FormFieldType = {
    fillValues ({ name }, record, values) {
      // let value = record[name];
      // if (value !== undefined) value = !!value;
      // values[name] = value;
      return values;
    },
    fillParams ({ name }, values, record) {
      // record[name] = values[name] ? '1' : '0';
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): UserPrivilege[] {
    return this.formValues[this.field.name] ?? [];
  }

  columns = [
    { name: 'type' },
  ];

  get privilegesTypesOptions () {
    return [
      { value: 'country-admin', text: this.$t('db.record.users.privileges.country_admin') },
    ];
  }

  onAdd () {
    const newItems = [ ...this.items ];
    newItems.push({ type: '' });
    this.context.onChange({ [this.field.name]: newItems });
  }

  onChange (newItems: UserPrivilege[]) {
    this.context.onChange({ [this.field.name]: newItems });
  }

  onSelectTypeFor (index: number, newType: string) {
    const newItems = [ ...this.items ];
    newItems[index] = createEmptyItem(newType);
    this.context.onChange({ [this.field.name]: newItems });
  }
}

function createEmptyItem (type: string): UserPrivilege {
  return {
    type,
  };
}
</script>
