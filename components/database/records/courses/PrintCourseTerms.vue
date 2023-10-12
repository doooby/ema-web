<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import PrintGroupTerm from '~/components/database/records/groups/PrintGroupTerm.vue';

@Component({
  components: { PrintGroupTerm },
})
export default class PrintCourseTerms extends Vue {
  @Prop({ required: true }) readonly dates!: app.List<{ begin: Date, end: Date }>;

  get groupTerms (): [Date, Date][] {
    return this.dates.filter(self => self).map(term => [
      term!.begin,
      term!.end,
    ]);
  }
}
</script>

<template>
  <ul>
    <li v-for="(date, index) of groupTerms" :key="index">
      <div class="d-flex">
        <div class="mr-2">
          {{ index + 1 }}&nbsp;:
        </div>
        <PrintGroupTerm :dates="date" />
      </div>
    </li>
  </ul>
</template>
