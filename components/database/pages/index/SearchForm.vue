<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import { TextInput } from '~/components/controls/inputs';
import * as localStorage from '~/lib/localStorage';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';

export interface Model {
  filtersShown: boolean;
}

@Component({
  components: { TextInput },
})
export default class SearchForm extends Vue {
  @Prop({ required: true }) readonly group!: controls.Group;
  @Prop({ required: true }) readonly entityScope!: string;

  get storageToken () {
    return {
      key: `EMA--pages--index--search--${this.entityScope}`,
      mapper: wai.object<Model>(parent => ({
        filtersShown: wai.property(parent, 'filtersShown', wai.boolean),
      })),
    };
  }

  model = app.nullable<Model>();
  filtersShown = false;

  mounted () {
    this.model = localStorage.get(this.storageToken);
    this.filtersShown = !!this.model?.filtersShown;
  }

  onSearch () {
    this.$emit('search');
  }

  onClear () {
    this.group.reset();
    this.onSearch();
  }

  @Watch('filtersShown')
  onFiltersShownChange (value: boolean) {
    this.model = {
      ...this.model,
      filtersShown: value,
    };
    localStorage.set(this.storageToken, this.model);
  }
}
</script>

<template>
  <div :class="['border p-3', $attrs.class]">

    <div
      class="d-flex flex-wrap"
      :style="{ gap: '16px' }"
    >
      <div :style="{ width: '150px' }">
        <TextInput
          dom-id="page_index_filters_search"
          :value="group.getValue('search')"
          @change="group.update('search', $event)"
          @submit="onSearch"
        />
      </div>
      <b-button
        size="sm"
        variant="primary"
        @click="onSearch"
      >
        <b-icon icon="search" class="mr-1" />
        <t value="db.page.index.filters.search_btn" />
      </b-button>
      <b-button
        v-b-toggle="'collapse__pages_search_form'"
        size="sm"
        variant="outline-secondary"
      >
        <b-icon
          :icon="filtersShown ? 'chevron-up' : 'chevron-down'"
          class="mr-1"
        />
        <t v-if="filtersShown" value="db.page.index.filters.hide_filters_btn" />
        <t v-else value="db.page.index.filters.show_filters_btn" />
      </b-button>
    </div>

    <div v-if="!filtersShown" class="mt-3" />

    <b-collapse
      id="collapse__pages_search_form"
      v-model="filtersShown"
    >
      <div class="row mt-3">
        <slot />
      </div>
      <div
        class="d-flex"
        style="gap: 16px;"
      >
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
    </b-collapse>

  </div>
</template>
