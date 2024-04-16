<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';
import controls from '~/components/controls';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';

@Component({
  components: {
    MoveStudents,
    SearchForm,
    PeopleListing,
    NewRecordButton,
    IndexPage2,
  },
})
export default class extends DatabasePage {
  searchParams = {};
  searchControls = controls.Group.compose();
}
</script>

<template>
  <IndexPage2
    entity="people"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template #header>
      <h4 class="m-0">
        <t value="db.menu.resource.people" />
      </h4>
      <b-tabs class="mt-3">
        <b-tab @click="$router.push('/database/students')">
          <template #title>
            <t value="db.menu.title.students" />
          </template>
        </b-tab>
        <b-tab active>
          <template #title>
            <t value="db.menu.title.all_people" />
          </template>
        </b-tab>
      </b-tabs>
    </template>

    <template #resource-actions>
      <nuxt-link
        v-if="$ema.canI('act:/people/create')"
        :to="`/database/people/new2`"
        class="btn btn-outline-secondary"
      >
        <b-icon icon="clipboard-plus" class="mr-1" />
        <t value="db.page.new.action" />
      </nuxt-link>
    </template>

    <template #search-form="{}" />

    <PeopleListing
      class="mt-3"
      :params="searchParams"
    >
      <template
        v-if="$admission.can('groups.move_students')"
        #group-actions="{ records }"
      >
        <MoveStudents :students="records" />
      </template>
    </PeopleListing>

  </IndexPage2>
</template>
