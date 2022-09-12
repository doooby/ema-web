<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <name-input
      :value="rawValue"
      @input="onChangeValue"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import NameInput from '~/components/Form/primitives/NameInput.vue';

@Component({
  mixins: [ ControlMixin ],
  components: { NameInput },
})
export default class Name extends Vue {
  static fieldType: FormFieldType = {
    name: 'name',
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ undefined, undefined ];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;
}
</script>
