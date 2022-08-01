<template>
  <b-list-group
    v-if="errors"
    :class="className"
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
import classNames from 'classnames';

export default Vue.extend({
  props: {
    errors: { type: Array as PropType<RecordError[]>, default: null },
  },
  computed: {
    className (): string {
      return classNames(
        'mb-3',
        this.$attrs.class,
      );
    },
  },
});
</script>
