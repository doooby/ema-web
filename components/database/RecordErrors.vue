<template>
  <b-list-group
    v-if="errors"
    :class="$attrs.class"
  >
    <b-list-group-item
      v-for="([attribute, message], index) in errors"
      :key="index"
      variant="danger"
    >
      <span v-if="attribute">
        <strong>
          <t :value="`db.record.${entity}.label.${attribute}`" />
        </strong>: {{ message }}
      </span>
      <span v-else>
        <t :value="`app.processing.${message}`" />
      </span>
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ErrorMessage, RequestResponse } from '~/lib/api2';

export function mapErrors<V> (
  response: undefined | RequestResponse<V>,
  map: (payload: V) => undefined | ErrorMessage[],
): undefined | ErrorMessage[] {
  if (response?.ok === false) {
    return [ [ undefined, response.reason || response.message ] ];
  }
  if (response?.ok) {
    return map(response.payload);
  }
}

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    errors: { type: Array as PropType<ErrorMessage[]>, default: null },
  },
});
</script>
