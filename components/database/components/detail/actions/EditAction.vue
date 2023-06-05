<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';

@Component({
  components: { ShowPageAction },
})
export default class EditAction extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: any;
}
</script>

<template>
  <li>
    <ShowPageAction
      icon="pencil"
      :path="`/database/${entity}/${record.id}/edit`"
    >
      <t value="db.page.edit.action" />
    </ShowPageAction>
  </li>
</template>
