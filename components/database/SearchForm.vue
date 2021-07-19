<template>
  <div class="emy-3 epx-3">
    <h5> {{ $t('db.browse.search') }} </h5>
    <form-view
      :value="searchValues"
      :fields="fields"
      @input="onInput"
      @commit="search"
    />
    <div class="d-flex flex-row-reverse">
      <b-button @click="search">
        <b-icon-search />
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BIconSearch } from 'bootstrap-vue';
import { createFormModel, FormField, FormValues, View as FormView } from '~/components/Form';

export default Vue.extend({
  components: { BIconSearch, FormView },
  props: {
    fields: { type: Array as PropType<Readonly<FormField[]>>, required: true },
    value: { type: Object as PropType<null | FormValues>, default: null },
  },
  data () {
    return {
      searchValues: this.value === null ? createFormModel() : this.value,
    };
  },
  methods: {
    onInput (value: FormValues) {
      this.searchValues = value;
      this.$emit('input', value);
    },
    search () {
      this.$emit('search', this.searchValues);
    },
  },
});
</script>
