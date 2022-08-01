<template>
  <div class="card">
    <div class="card-header">
      Basic Fields
    </div>
    <div class="card-body">
      <form-group
        v-model="values"
        class="container"
        :fields="fields"
      />
    </div>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { buildFormFields, prefillFormValues } from '~/components/Form';

@Component
export default class BasicForm extends Vue {
  fields = buildFormFields([
    [ 'text', 'text' ],
    [ 'list', 'list', {
      options: [
        { value: 'opt1', caption: 'Option 1' },
        { value: 'opt2', caption: 'Option 2' },
      ],
    } ],
    [ 'date', 'date' ],
    [ 'calendar', 'calendar' ],
    [ 'text_interactive', 'text', { interactive: true } ],
    [ 'text_multiline', 'textMultiline' ],
  ]);

  values = {
    ...prefillFormValues(this.fields),
    text: 'some text',
    list: 'opt2',
  };
}
</script>
