<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { person } from '~/lib/records';
import app from '~/lib/app';
import { DataTable } from '~/components/toolkit/DataTable';
import SimpleButton from '~/components/views/application/buttons/SimpleButton.vue';
import {
  DropdownSelect,
} from '~/components/controls/inputs';
import CaregiversFieldItem from '~/components/views/person/fields/caregiversField/CaregiversFieldItem.vue';
import NamesInputTable from '~/components/controls/inputs/extended/NamesInputTable.vue';

@Component({
  components: { CaregiversFieldItem, NamesInputTable, DropdownSelect, SimpleButton, DataTable },
})
export default class CaregiversField extends Vue {
  @Prop() readonly disabled?: boolean;
  @Prop({ required: true }) value!: app.Maybe<person.PersonCaregiver[]>;

  options = new app.internals.Options(this);

  get columns () {
    return DataTable.flattenColumns(
      { name: 'id', size: 24, fixedSize: true },
      { name: 'caregiver' },
    );
  }

  get caregiverTypeOptions () {
    return [
      ...this.options.getAll(this, 'caregivers.relation'),
      app.country.defaults.options.otherOption(),
    ];
  }

  onAddCaregiver () {
    const newValue = [
      ...(this.value ?? []),
    ];
    newValue.push({
      type: 'mother',
    });
    this.$emit('change', newValue);
  }

  onSetCaregiver (index: number, newCaregiver: person.PersonCaregiver) {
    const newValue = [
      ...(this.value ?? []),
    ];
    newValue[index] = newCaregiver;
    this.$emit('change', newValue);
  }

  onRemoveCaregiver (index: number) {
    const newValue = [
      ...(this.value ?? []),
    ];
    newValue.splice(index, 1);
    this.$emit('change', newValue);
  }
}
</script>

<template>
  <div class="row">
    <CaregiversFieldItem
      v-for="(caregiver, index) in value"
      :key="index"
      class="col-md-6"
      :index="index"
      :caregiver="caregiver"
      :type-options="caregiverTypeOptions"
      @change="onSetCaregiver(index, $event)"
      @remove="onRemoveCaregiver(index)"
    />
    <div class="col-12">
      <SimpleButton
        class="font-14 btn-sm btn-outline-secondary border-0"
        @click="onAddCaregiver"
      >
        <b-icon icon="plus" class="mr-1" />
        <t value="person.fields.CaregiversField.add" />
      </SimpleButton>
    </div>
  </div>
</template>
