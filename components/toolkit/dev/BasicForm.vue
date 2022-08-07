<template>
  <div class="card">
    <div class="card-header">
      Basic Fields
    </div>
    <div class="card-body pt-3 pb-0">
      <form-group v-model="values" :fields="fields" />
    </div>
    <div class="card-footer">
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
      <pre class="mt-3 mb-0">{{ JSON.stringify(values, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { buildFormFields, prefillFormValues } from '~/components/Form';

@Component
export default class BasicForm extends Vue {
  fields = buildFormFields([
    [ 'text', 'text' ],
    [ 'integer', 'integer' ],
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
    [ 'select_or_fill', 'selectOrFill', {
      options: [
        { value: 'opt1', text: 'Option 1' },
        { value: 'opt2', text: 'Option 2' },
      ],
    } ],
    [ 'date', 'date' ],
    [ 'calendar', 'calendar' ],
    [ 'name', 'name' ],
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
