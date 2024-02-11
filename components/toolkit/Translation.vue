<template>
  <span :class="$attrs.class">
    <a
      v-if="debugTranslations"
      class="mr-1 text-warning"
      :style="{ cursor: 'pointer' }"
      @click="onClickToOpen"
    >
      <b-icon icon="pencil" />
    </a>
    <span
      v-if="translatedText.isMissing"
      class="mr-1"
      title="missing translation"
    >
      <b-icon icon="type" class="text-danger" />
    </span>
    <span>
      {{ translatedText.value }}
    </span>
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
          :value="translatedText.isMissing ? '' : translatedText.value"
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

  get translatedText (): {
    isMissing: boolean;
    value: string;
    } {
    const value = this.$t(this.value) as string;
    const isMissing = this.value === value;

    if (isMissing) {
      if (this.$i18n.locale !== 'en') {
        const value_en = this.$t(this.value, 'en') as string;
        if (this.value === value_en) {
          return {
            isMissing,
            value: `key: ${value.replace(/\./g, ' ')}`,
          };
        } else {
          return {
            isMissing,
            value: value_en,
          };
        }
      } else {
        return {
          isMissing,
          value: value.replace(/\./g, ' '),
        };
      }
    }

    return { isMissing, value };
  }

  get debugTranslations (): boolean {
    const { user, debugTranslations } = this.$store.state.session;
    return !!(user && debugTranslations);
  }

  onClickToOpen (event) {
    event.preventDefault();
    event.stopPropagation();
    this.isModalShown = !this.isModalShown;
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
