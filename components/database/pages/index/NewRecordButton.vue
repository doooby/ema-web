<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class NewRecordButton extends Vue {
  @Prop({ required: true }) readonly entity!: string;
}
</script>

<template>
  <nuxt-link
    :to="`/database/${entity}/new`"
    class="btn btn-outline-secondary"
  >
    <b-icon icon="clipboard-plus" class="mr-1" />
    <t value="db.page.new.action" />
  </nuxt-link>
</template>
