<template>
  <div class="epx-3">
    <h5>
      {{ $t('db.search.header') }}
    </h5>
    <form-view
      v-model="searchValues"
      :fields="searchFields"
    />
    <div class="d-flex flex-row-reverse">
      <b-button
        size="lg"
        @click="search"
      >
        <b-icon-search />
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { BIconSearch } from 'bootstrap-vue';
import { defineFormFields, createFormModel } from '@c/Form';
import FormView from '@c/Form/View.vue';

const searchFields = defineFormFields(
  {
    name: 'name',
    controlType: 'text',
    t: 'db.users.record.name',
  },
);

export default Vue.extend({
  components: {
    BIconSearch,
    FormView,
  },
  data () {
    return {
      searchFields,
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
