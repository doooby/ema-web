<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-lg-4">
        <form-view
          v-model="basicsForm.value"
          :fields="basicsForm.fields"
        />
      </div>
      <div class="col-md-6 col-lg-8">
        <form-view
          v-model="inlineForm.value"
          :fields="inlineForm.fields"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-2"></div>
      <div class="col-md-6 col-lg-4">
        <form-view
          v-model="functionalitiesForm.value"
          :fields="functionalitiesForm.fields"
        />
      </div>
      <div class="col-md-6 col-lg-4">
        col 2
      </div>
      <div class="col-lg-2"></div>
    </div>
  </div>
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
      basicsForm: {
        value: {},
        fields: [
          [ 'text', 'text' ],
          [ 'list', 'list', { options: LIST_OPTIONS } ],
          [ 'date', 'date' ],
          [ 'calendar', 'calendar' ],
        ],
      },
      inlineForm: {
        value: {},
        fields: [
          [ 'group-small', 'group-row', {
            small: true,
            fields: [
              [ 'list', 'list', { options: LIST_OPTIONS } ],
              [ 'text', 'text' ],
              [ 'text2', 'text' ],
            ],
          } ],
          [ 'group', 'group-row', {
            scoped: true,
            fields: [
              [ 'list', 'list', { options: LIST_OPTIONS } ],
              [ 'text', 'text' ],
            ],
          } ],
        ],
      },
      functionalitiesForm: {
        value: {},
        fields: [
          [ 'text_with_left_side', 'text', { leftLabel: () => this.$t('misc.language.en') } ],
          [ 'text_with_right_side', 'text', { rightLabel: 'right' } ],
          [ 'integer_with_left_side', 'integer', { leftLabel: '$' } ],
          [ 'integer_with_right_side', 'integer', { rightLabel: 'Kč' } ],
          [ 'date', 'date', { deletable: true } ],
          [ 'calendar', 'calendar' ],
        ],
      },
    };
  },
});
</script>
