<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm/SearchForm.vue';
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
      scopedSlots: {
        'group-actions': context.scopedSlots['group-actions'],
      },
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
      <h4 class="m-0">
        <t :value="`db.menu.resource.${entity}`" />
      </h4>
      <nuxt-link
        v-if="$admission.can(`${entity}.create`)"
        :to="`/database/${entity}/new`"
        class="btn btn-outline-secondary mt-3"
      >
        <b-icon icon="clipboard-plus" class="mr-1" />
        <t value="db.page.new.action" />
      </nuxt-link>
      <search-form
        class="my-3"
        :entity="entity"
        :fields="searchFields"
        @search="searchParams=$event"
      />
      <records-listing
        :params="searchParams"
        :component="listingComponent"
      >
        <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
          <slot name="group-actions" :records="records" />
        </template>
      </records-listing>
    </div>
  </loaded-page>
</template>
