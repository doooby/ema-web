<!--<template>-->
<!--  <div :class="{ 'bg-warning': expanded && !subValues.course }">-->
<!--    <b-form-group-->
<!--      :label="labelText"-->
<!--    >-->
<!--      <b-form-radio-group-->
<!--        :value="'no'"-->
<!--        :options="assignYesNoOptions"-->
<!--        @input="onSelectAssignment"-->
<!--      />-->
<!--    </b-form-group>-->
<!--    <div v-if="expanded">-->
<!--      <associated-record-control-->
<!--        label="Select School"-->
<!--        :dom-id="`${domId}_school`"-->
<!--        :field="schoolField"-->
<!--        :form-values="subValues"-->
<!--        @change="onSchoolSelected"-->
<!--      />-->
<!--      <associated-record-control-->
<!--        v-if="subValues.school"-->
<!--        label="Select Course"-->
<!--        :dom-id="`${domId}_course`"-->
<!--        :field="courseField"-->
<!--        :form-values="subValues"-->
<!--        @change="onCourseSelected"-->
<!--      />-->
<!--      <associated-record-control-->
<!--        v-if="subValues.course"-->
<!--        label="Select Class"-->
<!--        :dom-id="`${domId}_group`"-->
<!--        :field="groupField"-->
<!--        :form-values="subValues"-->
<!--        @change="onGroupSelected"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from 'vue';-->
<!--import { FIELD_PROPS } from '~/components/Form';-->
<!--import AssociatedRecordControl from '~/components/Form/controls/AssociatedRecord.vue';-->

<!--export default Vue.extend({-->
<!--  components: { AssociatedRecordControl },-->
<!--  props: FIELD_PROPS,-->
<!--  data () {-->
<!--    return {-->
<!--      expanded: false,-->
<!--      assignYesNoOptions: [-->
<!--        { text: 'No', value: 'no' },-->
<!--        { text: 'Select course', value: 'yes' },-->
<!--      ],-->
<!--      subValues: {} as any,-->
<!--      schoolField: [ 'school', null, { entity: 'schools' } ],-->
<!--      courseField: [ 'course', null, { entity: 'courses' } ],-->
<!--      groupField: [ 'group', null, { entity: 'term_groups' } ],-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    labelText () {-->
<!--      return 'Assign Student to a Course:';-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    onSelectAssignment (value: any) {-->
<!--      this.expanded = value === 'yes';-->
<!--    },-->
<!--    onSchoolSelected (school: any) {-->
<!--      this.subValues = {-->
<!--        ...this.subValues,-->
<!--        school,-->
<!--      };-->
<!--    },-->
<!--    onCourseSelected (course: any) {-->
<!--      this.subValues = {-->
<!--        ...this.subValues,-->
<!--        course,-->
<!--      };-->
<!--      this.$emit('change', {-->
<!--        school_id: this.subValues.school.id,-->
<!--        course_id: course.id,-->
<!--      });-->
<!--    },-->
<!--    onGroupSelected (group: any) {-->
<!--      this.subValues = {-->
<!--        ...this.subValues,-->
<!--        group,-->
<!--      };-->
<!--      this.$emit('change', {-->
<!--        school_id: this.subValues.school.id,-->
<!--        course_id: this.subValues.course.id,-->
<!--        group_id: group.id,-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--});-->
<!--</script>-->
