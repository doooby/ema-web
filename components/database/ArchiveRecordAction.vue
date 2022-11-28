<template>
  <b-button
    :class="className"
    variant="link"
    @click="modalShown = true"
  >
    <b-icon icon="archive" class="emr-4" />
    <t value="db.action.archive.action" />
    <b-modal v-model="modalShown" centered @ok="onArchive">
      <template #modal-title>
        <t value="db.action.archive.action" />
      </template>
      <div>
        <p>
          <t value="db.action.archive.modal_text" />
        </p>
      </div>
    </b-modal>
  </b-button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import classNames from 'classnames';

@Component
export default class BrowsePageAction extends Vue {
  @Prop() readonly entity!: string;
  @Prop() readonly recordId!: number;

  modalShown = false;
  queryState = this.$api.newQueryState();

  get className (): string {
    return classNames('d-flex align-items-center', this.$attrs.class);
  }

  async onArchive () {
    if (this.queryState.running) return;

    const query = this.$api.queries[this.entity]?.record?.archive;
    if (!query) {
      this.modalShown = false;
      return;
    }

    await this.$api.request(
      query(this.recordId),
      this.queryState,
    );

    this.$emit('archived');
  }
}
</script>
