<template>
  <div class="ep-5">
    <h1><t value="db.page.index.title" /></h1>
    <h2 v-if="currentCountry">
      {{ currentCountry.record.caption }}
    </h2>
  </div>
</template>

<script lang="ts">
import { DatabasePage } from '~/components';

export default class Index extends DatabasePage {

}
</script>
