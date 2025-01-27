<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import { BRecordsSelect, OptionsSelect } from '~/components/controls/inputs';
import GroupsListing from '~/components/database/records/groups/GroupsListing.vue';
import ButtonToPath from '~/components/views/application/buttons/ButtonToPath.vue';

const nonAssignedOptions = Object.freeze([
  { value: '', item: 'db.record.groups.filters.non_classified.all' },
  { value: 'only', item: 'db.record.groups.filters.non_classified.only' },
  { value: 'exclude', item: 'db.record.groups.filters.non_classified.exclude' },
]);

@Component({
  components: {
    ButtonToPath,
    OptionsSelect,
    GroupsListing,
    NewRecordButton,
    IndexPage2,
    BRecordsSelect,
  },
})
export default class extends DatabasePage {
  searchParams = {};
  searchControls = controls.Group.compose(
    {
      name: 'school',
      populateParams: (values: any, params) => {
        params.school_id = values.school?.map(b => b.id)?.[0];
      },
      onChange: (values) => {
        values.courses = undefined;
      },
    },
    {
      name: 'courses',
      populateParams: (values: any, params) => {
        params.course_id =
          values.courses?.map(b => b.id);
      },
    },
    {
      name: 'non_classified',
      default: () => [ nonAssignedOptions[0] ],
      options: nonAssignedOptions as any,
      populateParams: (values: any, params) => {
        params.non_classified =
          values.non_classified?.map(b => b.value)?.[0];
      },
    },
  );
}
</script>

<template>
  <IndexPage2
    entity="groups"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template
      #resource-actions
    >
      <div class="d-flex">
        <ButtonToPath
          v-if="$ema.canI('act:/groups/actions/create')"
          class="btn-outline-secondary border-0"
          path="/database/groups/new"
        >
          <b-icon icon="clipboard-plus" class="mr-2" />
          <t value="db.page.new.action" />
        </ButtonToPath>
      </div>
    </template>

    <template #search-form="{ group }">
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="groups_filters_school"
      >
        <template #label>
          <t value="db.record.schools.meta.s" />
        </template>
        <template #default="{ labelId }">
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('school')"
            entity="schools"
            @change="group.update('school', $event)"
          />
        </template>
      </b-form-group>
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="groups_filters_courses"
      >
        <template #label>
          <t value="db.record.courses.meta.s" />
        </template>
        <template #default="{ labelId }">
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('courses')"
            entity="courses"
            :params="{ school_id: group.getParam('school_id') }"
            @change="group.update('courses', $event)"
          />
        </template>
      </b-form-group>
      <b-form-group
        class="col-md-4 col-lg-3"
      >
        <template #label>
          <t value="db.record.groups.filters.non_classified.label" />
        </template>
        <OptionsSelect
          :value="group.getValue('non_classified')"
          :options="group.getField('non_classified')?.options ?? []"
          @change="group.update('non_classified', $event)"
        >
          <template #option-content="{ option, selected }">
            <input type="radio" :checked="selected" class="mr-1">
            <t :value="option.item" />
          </template>
        </OptionsSelect>
      </b-form-group>
    </template>

    <GroupsListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
