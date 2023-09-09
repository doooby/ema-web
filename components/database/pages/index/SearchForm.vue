<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import { TextInput } from '~/components/controls/inputs';

@Component({
  components: { TextInput },
})
export default class SearchForm extends Vue {
  @Prop({ required: true }) readonly group!: controls.Group;

  onSearch () {
    this.$emit('search');
  }

  onClear () {
    this.group.reset();
    this.onSearch();
  }
}
</script>

<template>
  <div :class="['border p-3', $attrs.class]">
    <div class="row">

      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.page.index.filters.search')"
        label-for="page_index_filters_search"
      >
        <TextInput
          :dom-id="labelId"
          :value="group.getValue('search')"
          @change="group.update('search', $event)"
          @submit="onSearch"
        />
      </b-form-group>

      <slot />
    </div>
    <div class="d-flex justify-content-between">
      <b-button
        size="sm"
        variant="primary"
        @click="onSearch"
      >
        <b-icon icon="search" class="mr-1" />
        <t value="db.page.index.filters.search_btn" />
      </b-button>
      <b-button
        size="sm"
        variant="outline-secondary"
        @click="onClear"
      >
        <b-icon icon="x-lg" class="mr-1" />
        <t value="db.page.index.filters.clear_btn" />
      </b-button>
    </div>
  </div>
</template>
