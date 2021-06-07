<template>
  <browse-page
    entity="users"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { BrowsePage } from '~/components/database';
import { defineFormFields } from '~/components/Form';
import { defineTableColumns } from '~/components/DataTable';

export default Vue.extend({
  components: { BrowsePage },
  layout: 'database',
  data () {
    return {
      tableColumns: defineTableColumns(
        { key: 'id', caption: 'ID' },
        { key: 'login', caption: 'Login' },
        { key: 'country', caption: 'Country', value: user => user.country.name },
        { key: 'full_name', caption: 'Full Name' },
      ),
    };
  },
  computed: {
    searchFields () {
      return defineFormFields(
        { name: 'name', controlType: 'text', caption: this.$t('form.field.name') },
      );
    },
  },
});
</script>
