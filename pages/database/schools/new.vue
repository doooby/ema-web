<template>
  <new-page
    entity="schools"
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
        { name: 'name', controlType: 'text' },
        { name: 'address', controlType: 'text' },
      ],
    };
  },
});
</script>
