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
    this.$emit('search', this.group.getParamsValues());
  }
}
</script>

<template>
  <div :class="['card', $attrs.class]">
    <div class="card-body">
      <div class="row">

        <b-form-group
          v-slot="{ labelId }"
          class="col-md-4 col-lg-3"
          :label="$t('db.page.index.filters.search')"
          label-for="page_index_filters_search"
        >
          <TextInput
            :id="labelId"
            :value="group.state.search"
            @change="group.update('search', $event)"
            @submit="onSearch"
          />
        </b-form-group>

        <slot />
      </div>
      <div>
        <b-button
          size="sm"
          variant="primary"
          @click="onSearch"
        >
          <b-icon icon="search" class="mr-1" />
          <t value="db.pages.index.filters.search_btn" />
        </b-button>
      </div>
    </div>
  </div>
</template>
