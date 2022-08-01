<template>
  <div class="card">
    <div class="card-header">
      Basic Fields
    </div>
    <div class="card-body">
      <form-group v-model="values" :fields="fields" />
      <div class="d-flex justify-content-between">
        <div>
          <b-button variant="outline-success" :disabled="isProcessing" @click="onSubmit">
            <t value="app.action.save" />
          </b-button>
        </div>
        <div class="d-flex align-items-center">
          <btn-mini icon="backspace" variant="secondary" :disabled="isProcessing" @click="onReset" />
        </div>
        <div>
          <b-button variant="outline-secondary" :disabled="isProcessing">
            <t value="app.action.cancel" />
          </b-button>
        </div>
      </div>
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
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
      ],
    } ],
    [ 'select', 'select', {
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
      ],
    } ],
    [ 'date', 'date' ],
    [ 'calendar', 'calendar' ],
    [ 'text_interactive', 'text', { interactive: true } ],
    [ 'text_multiline', 'textMultiline' ],
  ]);

  defaultValues = {
    text: 'some text',
    list: 'opt2',
  }

  values = {
    ...prefillFormValues(this.fields),
    ...this.defaultValues,
  };

  isProcessing = false;

  onSubmit () {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
    }, 1000);
  }

  onReset () {
    this.values = {
      ...prefillFormValues(this.fields),
      ...this.defaultValues,
    };
  }
}
</script>
