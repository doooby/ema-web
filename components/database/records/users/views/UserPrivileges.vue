<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { user } from '~/lib/records';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { BRecordLink },
})
export default class UserPrivileges extends Vue {
  @Prop({ required: true }) user!: user.User;

}
</script>

<template>
  <ul>
    <li v-if="user.is_root">
      <t value="db.record.users.privileges.is_root" />
    </li>
    <li
      v-for="(privilege, index) of user.privileges"
      v-else
      :key="index"
    >
      <t :value="`db.record.users.privileges.${privilege.type}`" />
      <div v-if="privilege.type === 'school_manager'">
        <BRecordLink entity="schools" :record="privilege.school" />
      </div>
    </li>
  </ul>
</template>
