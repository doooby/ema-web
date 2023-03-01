<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <items-listing :columns="columns" :items="items" @add="onAdd" @change="onChange">
      <template #cell-type="{ index, item }">
        <b-form-select
          :value="item.type"
          :options="privilegesTypesOptions"
          @input="onSelectTypeFor(index, $event)"
        />
      </template>
    </items-listing>
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import { user } from '~/lib/records';
import { list } from '~/lib/api/mappers';

@Component({
  mixins: [ ControlMixin ],
})
export default class Privileges extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }, values, record) {
      record[name] = values[name] && list([ ...values[name] ]);
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get items (): user.UserPrivilege[] {
    return this.formValues[this.field.name] ?? [];
  }

  columns = [
    { name: 'type' },
  ];

  get privilegesTypesOptions () {
    return [
      { value: 'country_admin', text: this.$t('db.record.users.privileges.country_admin') },
      { value: 'collector', text: this.$t('db.record.users.privileges.collector') },
    ];
  }

  onAdd () {
    const newItems = [ ...this.items ];
    newItems.push(user.mapUserPrivilege(null));
    this.context.onChange({ [this.field.name]: newItems });
  }

  onChange (newItems: user.UserPrivilege[]) {
    this.context.onChange({ [this.field.name]: newItems });
  }

  onSelectTypeFor (index: number, newType: string) {
    const newItems = [ ...this.items ];
    newItems[index] = createEmptyItem(newType);
    this.context.onChange({ [this.field.name]: newItems });
  }
}

function createEmptyItem (type: string): user.UserPrivilege {
  return { type: type as any };
}
</script>
