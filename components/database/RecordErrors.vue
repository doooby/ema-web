<template>
  <b-list-group
    v-if="errors"
    class="mt-3"
  >
    <b-list-group-item
      v-for="([attribute, message], index) in errors"
      :key="index"
      variant="danger"
    >
      <strong>{{ attribute }}</strong>: {{ message }}
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RecordError } from '~/lib/api/mappers';

export default Vue.extend({
  props: {
    errors: {
      type: Array as PropType<RecordError[]>,
      default: null,
    },
  },
});
</script>
