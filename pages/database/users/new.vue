<template>
  <new-page
    entity="users"
    :fields="fields"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { NewPage } from '~/components/database';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  data () {
    return {
      fields: [
        { name: 'login', controlType: 'text' },
        { name: 'full_name', controlType: 'text' },
      ],
    };
  },
});
</script>
