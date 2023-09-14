<template>
  <form-group
    v-model="formValues"
    class="container"
    :fields-definitions="formFields"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-lg-2" />
        <div class="col-md-6 col-lg-4">
          <form-field name="association_country" :context="context" :values="values" />
          <form-field name="name" :context="context" :values="values" />
        </div>
        <div class="col-md-6 col-lg-4">
          col 2
        </div>
        <div class="col-lg-2" />
      </div>
    </template>
  </form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { asFieldType } from '~/components/Form';
import AbbreviatedRecordField from '~/components/database/records/AbbreviatedRecordField.vue';

export default Vue.extend({
  data () {
    return {
      formValues: {
        basic_text: 'some text',
        basic_list: 'opt2',
      },
      formFields: [
        [ 'association_country', asFieldType(AbbreviatedRecordField), { entity: 'countries' } ],
      ],
    };
  },
  methods: {
    onChange () {
      console.log({ ...this.formValues });
    },
  },
});
</script>
