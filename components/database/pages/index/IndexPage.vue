<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm.vue';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';

const RecordsListing = Vue.extend({
  functional: true,
  props: [ 'component', 'params' ],
  render (createElement, context): Vue.VNode {
    const component = context.props.component;
    if (!component) return createElement('span', '');
    return createElement(component, {
      props: {
        params: context.props.params,
      },
      class: 'mt-2',
    });
  },
});

@Component({
  components: {
    LoadedPage,
    SearchForm,
    RecordsListing,
  },
})
export default class IndexPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchFields!: FormFieldDefinition[];
  @Prop({ default: undefined }) readonly component!: any;

  searchParams = {};

  get listingComponent () {
    if (this.component) {
      return this.component;
    } else {
      throw new Error('listing component is needed');
    }
  }
}
</script>

<template>
  <loaded-page class="page-content">
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <t :value="`db.menu.resource.${entity}`" />
      </h4>
      <nuxt-link
        :to="`/database/${entity}/new`"
        class="btn btn-outline-secondary"
      >
        <b-icon icon="clipboard-plus" class="mr-1" />
        <t value="db.page.new.action" />
      </nuxt-link>
      <search-form
        class="mt-3"
        :entity="entity"
        :fields="searchFields"
        @search="searchParams=$event"
      />
      <records-listing
        :params="searchParams"
        :component="listingComponent"
      />
    </div>
  </loaded-page>
</template>
