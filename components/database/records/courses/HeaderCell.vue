<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { course } from '~/lib/records';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { BRecordLink, TextNames, ARecordLink },
})
export default class HeaderCell extends Vue {
  @Prop({ default: () => {} }) readonly record!: course.Course;
  @Prop({ default: undefined }) readonly hideSchool!: boolean;
}
</script>

<template>
  <div>
    <h6>
      <text-names class="text-truncate" :value="record.name">
        <template #prepend>
          <a-record-link
            :id="record.id"
            class="--header--id mx-2"
            entity="courses"
          />
        </template>
      </text-names>
    </h6>
    <div>
      <div v-if="!hideSchool" class="text-truncate --assoc">
        <small class="text-muted"><t value="db.record.schools.meta.s" /></small>
        <br>
        <b-record-link entity="schools" :record="record.school" />
      </div>
      <div class="text-truncate --assoc">
        <small class="text-muted"><t value="db.record.education_levels.meta.s" /></small>
        <br>
        <b-record-link entity="education_levels" :record="record.education_level" />
      </div>
    </div>
    <div />
  </div>
</template>

<style lang="css">
.--header--id {
  flex-basis: 80px;
}
.--assoc {
  font-size: 12px;
}
</style>
