<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { buildFormFields, FormFieldDefinition, formToRecordParams } from '~/components/Form';

@Component
export default class SearchForm extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];

  value = {};

  get formFields () {
    return buildFormFields(this.fields);
  }

  onValuesChange (values) {
    this.value = values;
  }

  onSearch () {
    this.$emit('search', formToRecordParams(this.formFields, this.value));
  }
}
</script>

<template>
  <div :class="['card', $attrs.class]">
    <div class="card-body">
      <form-group
        :value="value"
        class="row"
        :fields="formFields"
        :label-prefix="`db.record.${entity}.label`"
        @input="onValuesChange"
        @submit="onSearch"
      >
        <template #layout="{ context, values }">
          <div
            v-for="field in formFields"
            :key="field.name"
            class="col-md-6 col-lg-4 col-xl-2"
          >
            <form-field :name="field.name" :context="context" :values="values" />
          </div>
        </template>
      </form-group>
      <div>
        <b-button size="sm" variant="primary" @click="onSearch">
          <b-icon icon="search" class="mr-1" />
          <t value="db.listing.SearchForm.btn_search" />
        </b-button>
      </div>
    </div>
  </div>
</template>
