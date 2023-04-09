<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm.vue';
import RecordActions, { Action } from '~/components/database/cells/RecordActions.vue';

import EducationLevels from '~/components/database/records/education_levels/RecordsListing.vue';
import People from '~/components/database/records/people/RecordsListing.vue';
import { h } from 'vue';
import ActionsCell from '~/components/database/pages/index/ActionsCell.vue';

const RecordsListing = Vue.extend({
  functional: true,
  props: [ 'component', 'initialColumns', 'params' ],
  render (createElement, context): Vue.VNode {
    const component = context.props.component;
    if (!component) return createElement('span', '');
    return createElement(component, {
      props: {
        initialColumns: context.props.initialColumns,
        params: context.props.params,
      },
      class: 'mt-2',
      on: {
        change (records) {
          (context as any).listeners.change(records);
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
export default class Index4Page extends Vue {
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
    {
      name: 'actions',
      size: 65,
      fixedSize: true,
      renderCell: record => h(
        ActionsCell,
        {
          props: {
            entity: this.entity,
            record,
            selected: this.selectedRecords.includes(record),
            actions: this.actions,
          },
          on: {
            change: () => this.toggleSelect(record),
          },
        },
      ),
    },
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
<!--      <div class="mt-2">-->
<!--        group actions-->
<!--      </div>-->
      <records-listing
        :initial-columns="initialColumns"
        :params="searchParams"
        :component="listingComponent"
        @change="$emit('change', $event)"
      />
    </div>
  </div>
</template>
