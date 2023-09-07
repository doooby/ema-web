<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import controls from '~/components/controls';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';

@Component({
  components: { SearchForm, LoadedPage },
})
export default class IndexPage2 extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchControls!: controls.Group;
}
</script>

<template>
  <LoadedPage>
    <div class="container pt-4 pb-5">
      <h4 class="m-0">
        <t :value="`db.menu.resource.${entity}`" />
      </h4>
      <div v-if="$slots['resource-actions']" class="mt-3">
        <slot name="resource-actions" />
      </div>
      <SearchForm
        class="mt-3"
        :group="searchControls"
        @search="$emit('search', $event)"
      >
        <slot
          name="search-form"
          :group="searchControls"
        />
      </SearchForm>
      <slot />
    </div>
  </LoadedPage>
</template>
