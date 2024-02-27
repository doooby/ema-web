<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordId from '~/components/views/application/RecordId.vue';
import { wai } from '~/vendor/wai';

@Component({
  components: { RecordId },
})
export default class HeaderCell extends Vue {
  @Prop() record!: wai.AResource;
  @Prop() readonly path?: string;
  @Prop() name?: string;
}
</script>

<template>
  <div>
    <h5 v-if="name">
      {{ name }}
    </h5>
    <RecordId
      :record="record"
      :path="path"
    />
  </div>
</template>
