<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordId from '~/components/views/application/RecordId.vue';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export class RecordHeaderLabels {
  index = {} as app.Map<RecordHeaderLabel>;

  add (item: RecordHeaderLabel) {
    this.index[item.name] = item;
  }

  get count () {
    return Object.keys(this.index).length;
  }
}

interface RecordHeaderLabel {
  name: string;
  text?: string;
  [label: string]: any;
}

@Component({
  components: { RecordId },
})
export default class HeaderRow extends Vue {
  @Prop() record!: wai.AResource;
  @Prop() readonly path?: string;
  @Prop() names?: string[];
  @Prop() labels?: RecordHeaderLabels;
}
</script>

<template>
  <tr>
    <td colspan="99" class="border-0 pt-0">
      <h5 v-if="labels?.count">
        <span v-if="labels.index.archived" class="badge badge-dark">
          <t value="lexicon.archived" />
        </span>
      </h5>
      <h1>
        {{ names?.[1] }}
      </h1>
      <h4>
        <RecordId
          :record="record"
          :path="path"
        />
      </h4>
    </td>
  </tr>
</template>
