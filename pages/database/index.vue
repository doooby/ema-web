
<script lang="ts">
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import CountryDashboard from '~/components/database/pages/country/CountryDashboard/CountryDashboard.vue';

@Component({
  components: { CountryDashboard },
})
export default class Index extends DatabasePage {}
</script>

<template>
  <div class="ep-5">
    <h1><t value="db.page.index.title" /></h1>
    <h2 v-if="currentCountry">
      {{ currentCountry.record.caption }}
    </h2>

    <CountryDashboard />

  </div>
</template>
