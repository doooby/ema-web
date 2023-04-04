<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm.vue';
import RecordActions, { Action } from '~/components/database/cells/RecordActions.vue';

import EducationLevels from '~/components/database/records/education_levels/RecordsListing.vue';

const RecordsListing = Vue.extend({
  functional: true,
  props: [ 'component', 'initialColumns', 'params' ],
  render (createElement, context): Vue.VNode {
    const component = context.props.component;
    if (!component) return createElement('span', {}, '');
    return createElement(component, {
      props: {
        initialColumns: context.props.initialColumns,
        params: context.props.params,
      },
      class: 'mt-2',
      scopedSlots: {
        'col-actions': context.scopedSlots['col-actions'],
      },
    });
  },
});

@Component({
  components: {
    SearchForm,
    RecordsListing,
    RecordActions,
  },
})
export default class Index3Page extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchFields!: FormFieldDefinition[];
  @Prop({ required: true }) readonly actions!: Action[];

  searchParams = {};

  initialColumns = [
    { name: 'actions', headerText: false, size: 40 },
  ];

  get listingComponent () {
    switch (this.entity) {
      case 'education_levels': return EducationLevels;
      default: return null;
    }
  }
}
</script>

<template>
  <div class="page-content">
    <div class="container my-3">
      <h1><t :value="`db.menu.resource.${entity}`" /></h1>
      <div>
        <nuxt-link
          :to="`/${entity}/new`"
          tag="button"
          class="btn btn-secondary"
        >
          <b-icon icon="clipboard-plus" class="mr-1" />
          <t value="db.page.new.action" />
        </nuxt-link>
      </div>
      <search-form
        class="mt-3"
        :entity="entity"
        :fields="searchFields"
        @search="searchParams=$event"
      />
      <records-listing
        :initial-columns="initialColumns"
        :params="searchParams"
        :component="listingComponent"
      >
        <template #col-actions="{ record }">
          <record-actions
            :entity="entity"
            :record="record"
            :actions="actions"
          />
        </template>
      </records-listing>
    </div>
  </div>
</template>
