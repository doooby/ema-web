<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { group } from '~/lib/records';

@Component({
  components: {
    RecordId,
    RecordNamedValue,
  },
})
export default class DropoutGroup extends Vue {
  @Prop({ required: true }) readonly group!: group.dropout.GroupSlice;
}
</script>

<template>
  <div :class="$attrs.class">
    <RecordNamedValue>
      <template #label>
        <t value="db.record.schools.meta.s" />
      </template>
      <RecordId
        :record="group.school"
        :path="`/database/schools/${group.school.id}`"
      />
    </RecordNamedValue>
    <RecordNamedValue class="mt-1">
      <template #label>
        <t value="db.record.courses.meta.s" />
      </template>
      <RecordId
        :record="group.course"
        :path="`/database/courses/${group.course.id}`"
      />
    </RecordNamedValue>
    <RecordNamedValue class="mt-1">
      <template #label>
        <t value="db.record.groups.meta.s" />
      </template>
      <RecordId
        :record="group.group"
        :path="`/database/groups/${group.group.id}`"
      />
    </RecordNamedValue>
  </div>
</template>
