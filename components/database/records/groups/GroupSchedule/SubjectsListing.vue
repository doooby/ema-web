<template>
  <div>
    <div
      v-for="{subject, occurs, required} in requiredSubjects"
      :key="subject.id"
      class="em-2 epy-2 epx-3 border bg-light"
    >
      <div>
        <h4 class="em-0">
          {{ subject.name }}
        </h4>
        <small>{{ subject.name_en }}</small>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <b-button
            class="border-0"
            size="sm"
            variant="outline-secondary"
            @click="$emit('apply', subject)"
          >
            <b-icon icon="box-arrow-in-left" />
          </b-button>
          <b-button
            class="border-0"
            size="sm"
            variant="outline-secondary"
            @click="clearSubject = subject"
          >
            <b-icon icon="x-square" />
          </b-button>
        </div>
        <div :class="subjectStatsClassName(occurs, required)">
          {{ occurs }} / {{ required }}
        </div>
      </div>
    </div>
    <b-modal
      :visible="!!clearSubject"
      @ok="$emit('remove', clearSubject)"
      @hidden="clearSubject = null"
    >
      <template #modal-title>
        Clear all Occurrences of a Subject
      </template>
      <div v-if="clearSubject">
        <h4 class="em-0">
          {{ clearSubject.name }}
        </h4>
        <small>{{ clearSubject.name_en }}</small>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Subject } from '~/lib/records';
import { Occurrence } from '~/components/database/records/groups/GroupSchedule/index.vue';
import classNames from 'classnames';

interface SubjectRequirements {
  subject: Subject;
  occurs: number;
  required: number;
}

@Component
export default class SubjectsListing extends Vue {
  @Prop({ required: true }) readonly subjects!: Subject[];
  @Prop({ required: true }) readonly occurrences!: Occurrence[];

  clearSubject = null as null | Subject;

  get requiredSubjects (): SubjectRequirements[] {
    return (this.subjects).map((subject) => {
      const occurs = this.occurrences.filter(
        occurrence => subject.id === occurrence.subject.id,
      ).length;
      return {
        subject,
        occurs,
        required: 20,
      };
    });
  }

  subjectStatsClassName (occurs: number, required: number): string {
    return classNames(
      occurs < required ? 'text-danger' : 'text-success',
      '',
    );
  }
}
</script>
