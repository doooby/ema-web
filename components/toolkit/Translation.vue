<template>
  <span :class="$attrs.class">
    {{ translatedText }}
    <b-icon
      v-if="debugTranslations"
      icon="chat-left-quote"
      class="d-inline-block"
      @click.prevent.capture="isModalShown = !isModalShown"
    />
    <b-modal
      id="modal"
      :visible="isModalShown"
      @show="isModalShown = !isModalShown"
      @hide="newTranslation = ''; stateMessage='';"
    >
      <template #modal-title>
        {{ value }}
        <b-button variant="outline-secondary" @click="onCopy">
          <b-icon icon="clipboard-plus" />
        </b-button>
      </template>

      <b-form-group
        v-if="value"
        label="New translation"
        label-for="translation-new"
      >
        <b-form-input
          id="translation-new"
          :value="translatedText"
          @input.native="onInput"
          @keydown.ctrl.enter="onChange"
        />
        <div class="flex flex-row">
          <div>{{ stateMessage }}</div>
        </div>
      </b-form-group>
      <template #modal-footer="{ hide }">
        <b-overlay :show="saveRequest.processing">
          <b-button
            @click="onChange"
          >Save</b-button>
          <b-button @click="hide">Cancel</b-button>
        </b-overlay>
      </template>
    </b-modal>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { reloadLocales } from '~/lib/api/session';
import { parsers, UpdatedRecordResponsePayload } from '~/lib/api2';

@Component
export default class Translation extends Vue {
  @Prop({ required: true }) value!: string;
  @Prop({ required: false }) position?: boolean;

  isModalShown: boolean = false;
  stateMessage: string = '';
  newTranslation = '';

  saveRequest = this.$api2.newQueryState<UpdatedRecordResponsePayload>();

  get translatedText (): string {
    return this.$t(this.value) as string;
  }

  get debugTranslations (): boolean {
    const { user, debugTranslations } = this.$store.state.session;
    return !!(user && debugTranslations);
  }

  onCopy (): void {
    navigator.clipboard.writeText(this.value);
  }

  onChange (save:boolean):void {
    if (!this.newTranslation) {
      this.stateMessage = 'No changes!';
      return;
    }
    if (save) {
      this.onSave();
    }
    this.newTranslation = '';
  }

  async onSave () {
    const currentLocale = this.$i18n.locale;
    await this.$api2.request(
      this.saveRequest,
      {
        path: '/translation_values/update',
        params: {
          language: currentLocale,
          key: this.value,
          record: {
            value: this.newTranslation,
          },
        },
        reducer: parsers.updatedRecordResponsePayload(),
      },
    );

    if (this.saveRequest.response?.ok) {
      await reloadLocales(this, currentLocale);
      this.stateMessage = 'SUCCESS!';
      setTimeout(() => {
        this.$root.$emit('bv::hide::modal', 'modal');
      }, 650);
    } else {
      this.stateMessage = 'FAILED TO SAVE!';
    }
  }

  onInput (event) {
    this.newTranslation = event.target.value;
  }
}

</script>
