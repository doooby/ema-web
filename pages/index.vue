<template>
  <div>
    <h1>EMA Monitoring v2</h1>
    <p>
      We're working on it.
    </p>
    <nuxt-link to="/database">
      go to DB
    </nuxt-link>
    <hr>
    <h3>admin:</h3>
    <ul>
      <li>
        <a href="/admin/translations">Translations</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { PageSessionMixin } from '~/components';

@Component
export default class Index extends PageSessionMixin {

}
</script>
