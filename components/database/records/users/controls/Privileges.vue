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
      <template #cell-options="{ index, item }">
        <b-records-select
          v-if="item.type === 'school_manager'"
          entity="schools"
          :single-record="true"
          title="db.record.schools.meta.s"
          :records="item.school ? [item.school] : []"
          @change="onChangeOptionsFor(index, { school: $event[0] })"
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
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';

@Component({
  components: { BRecordsSelect },
  mixins: [ ControlMixin ],
})
export default class Privileges extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }, values, record) {
      const privileges = values[name].map((value) => {
        switch (value.type) {
          case 'country_admin':
          case 'collector':
          case 'data_officer':
            return { type: value.type };
          case 'school_manager':
            return { type: value.type, school_id: value.school?.id };
          default:
            return {};
        }
      });
      record[name] = privileges;
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
    { name: 'type', size: 200 },
    { name: 'options', size: 300 },
  ];

  get privilegesTypesOptions () {
    return [
      { value: 'country_admin', text: this.$t('db.record.users.privileges.country_admin') },
      { value: 'data_officer', text: this.$t('db.record.users.privileges.data_officer') },
      { value: 'collector', text: this.$t('db.record.users.privileges.collector') },
      { value: 'school_manager', text: this.$t('db.record.users.privileges.school_manager') },
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

  onChangeOptionsFor (index: number, data: Record<string, any>) {
    const newItems = [ ...this.items ];
    newItems[index] = { ...newItems[index], ...data };
    this.context.onChange({ [this.field.name]: newItems });
  }
}

function createEmptyItem (type: string): user.UserPrivilege {
  return { type: type as any };
}
</script>
