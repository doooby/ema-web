<template>
  <div>
    <h1>DB index</h1>

    <ul>
      <li>
        <nuxt-link to="/database/countries/browse">
          Countries
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/database/users/browse">
          Users
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'database',
});
</script>
