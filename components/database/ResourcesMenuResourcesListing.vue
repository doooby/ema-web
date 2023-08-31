<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ResourcesMenuResourcesListing extends Vue {
  get admissible () {
    return this.$admission.indexCan(
      'users.index',
      'donors.index',
      'projects.index',
      'education_levels.index',
      'standardized_courses.index',
      'subjects.index',
      'subject_categories.index',
      'school_years.index',
      'schools.index',
      'courses.index',
      'groups.index',
      'people.index',
      'work_agreements.index',
      'material_kits.index',
    );
  }
}
</script>

<template>
  <ul class="list-unstyled">

    <li v-if="admissible['users.index']">
      <nuxt-link to="/database/users">
        <t value="db.menu.resource.users" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['donors.index']">
      <nuxt-link to="/database/donors">
        <t value="db.menu.resource.donors" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['projects.index']">
      <nuxt-link to="/database/projects">
        <t value="db.menu.resource.projects" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['education_levels.index']">
      <nuxt-link to="/database/education_levels">
        <t value="db.menu.resource.education_levels" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['standardized_courses.index']">
      <nuxt-link to="/database/standardized_courses">
        <t value="db.menu.resource.standardized_courses" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['subjects.index']">
      <nuxt-link to="/database/subjects">
        <t value="db.menu.resource.subjects" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['subject_categories.index']">
      <nuxt-link to="/database/subject_categories">
        <t value="db.menu.resource.subject_categories" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['school_years.index']">
      <nuxt-link to="/database/school_years">
        <t value="db.menu.resource.school_years" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['schools.index']">
      <nuxt-link to="/database/schools">
        <t value="db.menu.resource.schools" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['courses.index']">
      <nuxt-link to="/database/courses">
        <t value="db.menu.resource.courses" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['groups.index']">
      <nuxt-link to="/database/groups">
        <t value="db.menu.resource.groups" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['people.index']">
      <nuxt-link to="/database/people">
        <t value="db.menu.resource.people" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['work_agreements.index']">
      <nuxt-link to="/database/work_agreements">
        <t value="db.menu.resource.work_agreements" class="text-capitalize" />
      </nuxt-link>
    </li>

    <li v-if="admissible['material_kits.index']">
      <nuxt-link to="/database/material_kits">
        <t value="db.menu.resource.material_kits" class="text-capitalize" />
      </nuxt-link>
    </li>

  </ul>
</template>
