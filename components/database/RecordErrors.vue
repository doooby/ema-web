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
      <strong>
        <t :value="`db.record.${entity}.label.${attribute}`" />
      </strong>: {{ message }}
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RecordChangeError } from '~/lib/api/mappers';
import classNames from 'classnames';

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    errors: { type: Array as PropType<RecordChangeError[]>, default: null },
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
