<template>
  <IndexPage
    entity="users"
    :search-fields="searchFields"
    :component="Users"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import Users from '~/components/database/records/users/UsersListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ];

  Users = Users;
}
</script>
