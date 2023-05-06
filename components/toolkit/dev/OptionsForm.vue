<template>
  <div class="card">
    <div class="card-header">
      Fields with varying options
    </div>
    <div class="card-body">
      <form-group
        v-model="values"
        class="container"
        :fields="fields"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { buildFormFields, controls, prefillFormValues } from '~/components/Form';

@Component
export default class OptionsForm extends Vue {
  fields = buildFormFields([
    [ 'text_with_left_side', controls.text, { leftLabel: () => this.$t('misc.language.en') } ],
    [ 'text_with_right_side', controls.text, { rightLabel: 'right' } ],
    [ 'integer_with_left_side', controls.integer, { leftLabel: '$' } ],
    [ 'integer_with_right_side', controls.integer, { rightLabel: 'Kč' } ],
  ])

  values = {
    ...prefillFormValues(this.fields),
  }
}
</script>
