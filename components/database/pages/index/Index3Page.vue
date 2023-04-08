<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm.vue';
import RecordActions, { Action } from '~/components/database/cells/RecordActions.vue';

import EducationLevels from '~/components/database/records/education_levels/RecordsListing.vue';
import People from '~/components/database/records/people/RecordsListing.vue';

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
      scopedSlots: { ...context.scopedSlots },
      on: {
        list (records) {
          context.listeners.list(records);
        },
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

  records: any[] = [];
  selectedRecords: any[] = [];

  @Watch('records')
  onRecordsChanged () {
    this.selectedRecords = [];
  }

  initialColumns = [
    // { name: 'selection', size: 40 },
    { name: 'actions', headerText: false, size: 40 },
  ];

  get listingComponent () {
    switch (this.entity) {
      case 'education_levels': return EducationLevels;
      case 'people': return People;
      default: return null;
    }
  }

  get isAllSelected () {
    if (!this.records.length) return false;
    return this.selectedRecords.length === this.records.length;
  }

  toggleSelect (record) {
    const index = this.selectedRecords.indexOf(record);
    if (index === -1) {
      this.selectedRecords.push(record);
    } else {
      this.selectedRecords.splice(index, 1);
    }
  }

  toggleSelectAll () {
    if (this.isAllSelected) {
      this.selectedRecords = [];
    } else {
      this.selectedRecords = [ ...this.records ];
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
          :to="`/database/${entity}/new`"
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
        @list="records = $event"
      >
        <template #col-h-selection>
          <b-form-checkbox :checked="isAllSelected" @change="toggleSelectAll" />
        </template>
        <template #col-selection="{record}">
          <b-form-checkbox
            class="ml-2"
            :checked="selectedRecords.includes(record)"
            @change="toggleSelect(record)"
          />
        </template>
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
