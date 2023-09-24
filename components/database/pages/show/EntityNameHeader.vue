<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TextNames from '~/components/database/components/TextNames.vue';

@Component({
  components: { TextNames },
})
export default class EntityNameHeader extends Vue {
  @Prop() readonly record?: unknown;
  @Prop() readonly name?: string[];
}
</script>

<template>
  <h2>
    <TextNames v-if="record" :value="name" />
    <b-skeleton v-else width="100%" height="40px" />
  </h2>
</template>
