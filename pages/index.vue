<template>
  <div class="page-content -padded">
    <h1>EMA Monitoring v2</h1>
    <p>
      Is it any good?
      <br>
      <a href="https://news.ycombinator.com/item?id=3067434">yes.</a>
    </p>
    <hr>
    <h3>Homepage</h3>
    <p>
      We're working on it.
    </p>
    <h3>Database</h3>
    <ul>
      <li>
        <nuxt-link to="/database">
          browse
        </nuxt-link>
      </li>
    </ul>
    <h3>Admin</h3>
    <ul>
      <li>
        <a href="/admin/translations/edit/en">Edit EN Translations</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { AppPage } from '~/components';

@Component
export default class Index extends AppPage {}
</script>
