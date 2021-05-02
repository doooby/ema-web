<template>
  <div class="epx-3">
    <div class="d-flex epy-3">
      <b-icon-lightning font-scale="2" />
    </div>
    <h5>
      <span>database_page.users.browse.search.title</span>
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
import { BIconLightning, BIconSearch } from 'bootstrap-vue';
import { defineFormFields, createFormModel } from '@lib/Form';
import FormView from '@lib/Form/View.vue';

const searchFields = defineFormFields(
  {
    name: 'search',
    controlType: 'text',
  },
);

export default Vue.extend({
  components: {
    BIconLightning,
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
