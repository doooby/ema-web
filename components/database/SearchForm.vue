<template>
  <div class="emy-3 epx-3">
    <h5> {{ $t('db.search.header') }} </h5>
    <form-view
      v-model="searchValues"
      :fields="fields"
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
import { createFormModel, FormField, View as FormView } from '@/components/Form';

export default Vue.extend({
  components: { BIconSearch, FormView },
  props: {
    fields: { type: Array as PropType<Readonly<FormField[]>>, required: true },
  },
  data () {
    return {
      searchValues: createFormModel(),
    };
  },
  methods: {
    search () {
      this.$emit('search', this.searchValues);
    },
  },
});
</script>
