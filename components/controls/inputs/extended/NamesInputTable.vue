<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import TextInput from '~/components/controls/inputs/base/TextInput.vue';

@Component({
  components: { TextInput },
})
export default class NamesInputTable extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: app.PersonNames;

  onChange (
    nameIndex: number,
    languageIndex: number,
    value?: string,
  ) {
    const newNames = [
      updateVariants(this.value?.[0]),
      updateVariants(this.value?.[1]),
      updateVariants(this.value?.[2]),
    ];
    const variants = newNames[nameIndex];
    variants[languageIndex] = value ?? '';
    this.$emit('change', newNames);
  }
}

function updateVariants (source?: app.SparseList<string>) {
  return [
    source?.[0] ?? '',
    source?.[1] ?? '',
  ];
}
</script>

<template>
  <div :class="$attrs.class">
    <div class="row no-gutters font-14 text-muted" style="gap: 2px;">
      <span class="col">
        <t value="controls.inputs.NamesInputTable.col1" />
      </span>
      <span class="col">
        <t value="controls.inputs.NamesInputTable.col2" />
      </span>
      <span class="col">
        <t value="controls.inputs.NamesInputTable.col3" />
      </span>
    </div>
    <div class="row no-gutters" style="gap: 2px;">
      <div class="col">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">EN</span>
          </div>
          <TextInput
            :dom-id="`${domId}--en`"
            :value="value?.[0]?.[0]"
            :disabled="disabled"
            @change="onChange(0, 0, $event)"
          />
        </div>
      </div>
      <div class="col">
        <TextInput
          :value="value?.[1]?.[0]"
          :disabled="disabled"
          @change="onChange(1, 0, $event)"
        />
      </div>
      <div class="col">
        <TextInput
          :value="value?.[2]?.[0]"
          :disabled="disabled"
          @change="onChange(2, 0, $event)"
        />
      </div>
    </div>
    <div class="row no-gutters" style="margin-top: 2px; gap: 2px;">
      <div class="col">
        <TextInput
          :value="value?.[0]?.[1]"
          :disabled="disabled"
          @change="onChange(0, 1, $event)"
        />
      </div>
      <div class="col">
        <TextInput
          :value="value?.[1]?.[1]"
          :disabled="disabled"
          @change="onChange(1, 1, $event)"
        />
      </div>
      <div class="col">
        <TextInput
          :value="value?.[2]?.[1]"
          :disabled="disabled"
          @change="onChange(2, 1, $event)"
        />
      </div>
    </div>
  </div>
</template>
