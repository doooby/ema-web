<template>
  <b-button
    :class="className"
    variant="link"
    @click="modalShown = true"
  >
    <b-icon icon="archive" class="emr-4" />
    <t value="db.page.archive.action" />
    <b-modal v-model="modalShown" centered @ok="onArchive">
      <template #modal-title>
        <t value="db.page.archive.modal.title" />
      </template>
      <div>
        <p>
          <t value="db.page.archive.modal.text" />
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
