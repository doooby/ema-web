<template>
  <div class="container pb-5">
    <div class="p-3">
      <nuxt-link to="/">
        GOTO HOME
      </nuxt-link>
    </div>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4">
        <basic-form />
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <options-form />
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <location-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BasicForm from '~/components/toolkit/dev/BasicForm.vue';
import OptionsForm from '~/components/toolkit/dev/OptionsForm.vue';
import LocationForm from '~/components/toolkit/dev/LocationForm.vue';

@Component({
  components: { BasicForm, OptionsForm, LocationForm },
})
export default class Form_controls extends Vue {

}
</script>
