<template>
  <div class="emy-3 epx-3">
    <h5> {{ $t('db.browse.search') }} </h5>
    <form-group
      :value="searchValues"
      :fields-definitions="fields"
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
import Vue from 'vue';
import { BIconSearch } from 'bootstrap-vue';
import { FormField, FormValues } from '~/components/Form';

export default Vue.extend({
  components: { BIconSearch },
  props: {
    fields: { type: Array as Vue.PropType<FormField[]>, required: true },
  },
  data () {
    return {
      searchValues: Object.freeze({}),
    };
  },
  methods: {
    onInput (value: FormValues) {
      this.searchValues = value;
    },
    search () {
      this.$emit('search', this.searchValues);
    },
  },
});
</script>
