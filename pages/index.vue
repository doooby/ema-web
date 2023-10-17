<script lang="ts">
import { Component } from 'vue-property-decorator';
import { AppPage } from '~/components';

@Component
export default class Index extends AppPage {
  get userSession () {
    return this.$ema.userSession;
  }
}
</script>

<template>
  <div class="page-content -padded">
    <h1>EMA Monitoring v2</h1>
    <div class="mt2">
      <ul>
        <li>
          <div
            style="height: 26px;"
            class="m-1"
          >
            <nuxt-link to="/">
              <h6 class="m-0 d-flex align-items-center">
                <b-icon icon="house-door-fill" class="mr-2" />
                <t value="top_bar.action.home" />
              </h6>
            </nuxt-link>
          </div>
        </li>
        <li v-if="userSession">
          <div
            style="height: 26px;"
            class="d-flex align-items-center"
          >
            <nuxt-link to="/database">
              <h6 class="m-0 d-flex align-items-center">
                <b-icon icon="server" class="mr-2" />
                <t value="top_bar.action.db" />
              </h6>
            </nuxt-link>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="!userSession">
      <b-alert show variant="info">
        <t value="app.user_not_present" />
      </b-alert>
    </div>
  </div>
</template>
