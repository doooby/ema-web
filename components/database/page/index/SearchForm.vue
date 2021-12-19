<template>
  <div class="emy-3 epx-3">
    <h5>
      <t value="db.page.index.search.title" />
    </h5>
    <form-group
      :value="searchValues"
      :fields="fields"
      :label-prefix="fieldsPrefix"
      @input="onInput"
    />
    <div class="d-flex flex-row-reverse">
      <b-button @click="search">
        <b-icon-search />
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormValues, prefillFormValues } from '~/components/Form';

@Component
export default class SearchForm extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormField[];

  searchValues = prefillFormValues(this.fields);
  fieldsPrefix = 'db.record.countries.search';

  onInput (value: FormValues) {
    this.searchValues = value;
  }

  search () {
    this.$emit('search', this.searchValues);
  }
}
</script>
