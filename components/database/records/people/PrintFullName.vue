<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { person } from '~/lib/records';

@Component
export default class PrintFullName extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;
}
</script>

<template>
  <div>
    <div v-if="person.full_name_local">
      {{ person.full_name_local }}
    </div>
    <div class="font-12">
      <span>{{ person.first_name[0] }}</span>
      <span v-if="person.last_name"> {{ person.last_name[0] }}</span>
    </div>
  </div>
</template>
