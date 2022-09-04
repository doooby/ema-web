<template>
  <b-modal :visible="value" centered hide-footer @hidden="$emit('input', false)">
    <template #modal-title>
      <slot name="title" />
    </template>
    <b-list-group v-if="value">
      <b-list-group-item
        v-if="blankOption"
        key="--blank--"
        button
        @click="onItemSelected()"
      >
        <t value="db.record.shared.label.any" />
      </b-list-group-item>
      <b-list-group-item
        v-for="item in list"
        :key="item.value"
        :active="selected === item"
        button
        @click="onItemSelected(item)"
      >
        {{ item.text }}
      </b-list-group-item>
    </b-list-group>
    <b-alert
      v-if="list === null || list.length === 0"
      show
      variant="secondary"
    >
      empty
    </b-alert>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Option } from '~/lib/types';

@Component
export default class SelectModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop() readonly blankOption?: boolean;
  @Prop({ required: true }) readonly list!: Option[];
  @Prop({ required: true }) readonly selected!: Option;

  onItemSelected (item?: Option) {
    this.$emit('select', item?.value ?? '');
  }
}
</script>
