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
import { buildFormFields, prefillFormValues } from '~/components/Form';

@Component
export default class OptionsForm extends Vue {
  fields = buildFormFields([
    [ 'text_with_left_side', 'text', { leftLabel: () => this.$t('misc.language.en') } ],
    [ 'text_with_right_side', 'text', { rightLabel: 'right' } ],
    [ 'integer_with_left_side', 'integer', { leftLabel: '$' } ],
    [ 'integer_with_right_side', 'integer', { rightLabel: 'Kč' } ],
  ])

  values = {
    ...prefillFormValues(this.fields),
  }
}
</script>
