<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { FormFieldDefinition } from '~/components/Form';
import SearchForm from '~/components/database/components/listing/SearchForm.vue';
import RecordActions, { Action } from '~/components/database/cells/RecordActions.vue';
import { h } from 'vue';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';
import ActionsCell from '~/components/database/pages/index/ActionsCell.vue';

import CoursesListing from '~/components/database/records/courses/RecordsListing.vue';
import DonorsListing from '~/components/database/records/donors/RecordsListing.vue';
import EducationLevelsListing from '~/components/database/records/education_levels/RecordsListing.vue';
import GroupsListing from '~/components/database/records/groups/RecordsListing.vue';
import MaterialKitsListing from '~/components/database/records/material_kits/RecordsListing.vue';
import PeopleListing from '~/components/database/records/people/RecordsListing.vue';
import ProjectsListing from '~/components/database/records/projects/RecordsListing.vue';
import SchoolsListing from '~/components/database/records/schools/RecordsListing.vue';
import SchoolYearsListing from '~/components/database/records/school_years/RecordsListing.vue';
import StandardizedCoursesListing from '~/components/database/records/standardized_courses/RecordsListing.vue';
import SubjectCategoriesListing from '~/components/database/records/subject_categories/RecordsListing.vue';
import SubjectsListing from '~/components/database/records/subjects/RecordsListing.vue';
import UsersListing from '~/components/database/records/users/RecordsListing.vue';

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
    LoadedPage,
    SearchForm,
    RecordsListing,
    RecordActions,
  },
})
export default class IndexPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly searchFields!: FormFieldDefinition[];
  @Prop({ required: true }) readonly actions!: Action[];
  @Prop({ deafult: undefined }) readonly component!: any;

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
    if (this.component) {
      return this.component;
    }
    switch (this.entity) {
      case 'courses': return CoursesListing;
      case 'donors': return DonorsListing;
      case 'education_levels': return EducationLevelsListing;
      case 'groups': return GroupsListing;
      case 'material_kits': return MaterialKitsListing;
      case 'people': return PeopleListing;
      case 'projects': return ProjectsListing;
      case 'schools': return SchoolsListing;
      case 'school_years': return SchoolYearsListing;
      case 'standardized_courses': return StandardizedCoursesListing;
      case 'subject_categories': return SubjectCategoriesListing;
      case 'subjects': return SubjectsListing;
      case 'users': return UsersListing;
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
  <loaded-page class="page-content">
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <t :value="`db.menu.resource.${entity}`" />
      </h4>
      <nuxt-link
        :to="`/database/${entity}/new`"
        tag="button"
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
      <!--      <div class="mt-2">-->
      <!--        group actions-->
      <!--      </div>-->
      <records-listing
        :initial-columns="initialColumns"
        :params="searchParams"
        :component="listingComponent"
        @change="records = $event"
      />
    </div>
  </loaded-page>
</template>
