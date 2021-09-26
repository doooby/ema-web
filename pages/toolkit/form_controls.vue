<template>
  <form-group
    v-model="formValues"
    class="container"
    :fields="formFields"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <form-field name="basic_text" :context="context" :values="values" />
          <form-field name="basic_list" :context="context" :values="values" />
          <form-field name="basic_date" :context="context" :values="values" />
          <form-field name="basic_calendar" :context="context" :values="values" />
        </div>
        <div class="col-md-6 col-lg-8">
          <!--        <form-view-->
          <!--          v-model="inlineForm.value"-->
          <!--          :fields="inlineForm.fields"-->
          <!--        />-->
        </div>
      </div>
      <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-md-6 col-lg-4">
          <form-field name="opts_text_with_left_side" :context="context" :values="values" />
          <form-field name="opts_text_with_right_side" :context="context" :values="values" />
          <form-field name="opts_integer_with_left_side" :context="context" :values="values" />
          <form-field name="opts_integer_with_right_side" :context="context" :values="values" />
          <form-field name="more_text_multiline" :context="context" :values="values" />
          <form-field name="more_association_country" :context="context" :values="values" />
        </div>
        <div class="col-md-6 col-lg-4">
          col 2
        </div>
        <div class="col-lg-2"></div>
      </div>
    </template>
  </form-group>
</template>

<script lang="ts">
import Vue from 'vue';

const LIST_OPTIONS = [
  { value: 'opt1', caption: 'Option 1' },
  { value: 'opt2', caption: 'Option 2' },
];

export default Vue.extend({
  data () {
    return {
      formValues: Object.freeze({
        basic_text: 'some text',
        basic_list: 'opt2',
      }),
      formFields: [
        [ 'basic_text', 'text' ],
        [ 'basic_list', 'list', { options: LIST_OPTIONS } ],
        [ 'basic_date', 'date' ],
        [ 'basic_calendar', 'calendar' ],

        [ 'opts_text_with_left_side', 'text', { leftLabel: () => this.$t('misc.language.en') } ],
        [ 'opts_text_with_right_side', 'text', { rightLabel: 'right' } ],
        [ 'opts_integer_with_left_side', 'integer', { leftLabel: '$' } ],
        [ 'opts_integer_with_right_side', 'integer', { rightLabel: 'Kč' } ],

        [ 'more_text_multiline', 'textMultiline' ],
        [ 'more_association_country', 'associatedRecord', { entity: 'countries' } ],
        // [ 'opts_date_deletable', 'date', { deletable: true } ],
        // [ 'opts_calendar_deletable', 'calendar', { deletable: true } ],
      ],
    };
  },
  watch: {
    formValues (newValue) {
      console.log(newValue);
    },
  },
});
</script>
