<template>
  <b-form-group>
    file input
    <input
      :id="domIdBase"
      type="file"
      accept="image/png, image/jpeg"
      @change="onChange"
    >
    <!--    <b-form-checkbox-->
    <!--      :id="domIdBase"-->
    <!--      :checked="sanitizedValue"-->
    <!--      @input="onInput"-->
    <!--    >-->
    <!--      <t :value="labelTranslation" />-->
    <!--    </b-form-checkbox>-->
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';

@Component({
  mixins: [ ControlMixin ],
})
export default class Boolean extends Vue {
  static fieldType: FormFieldType = { name: 'imageFile' };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get sanitizedValue (): any {
    return this.formValues[this.field.name];
  }

  @Watch('sanitizedValue')
  onSanitizedValueChange (newValue: any) {
    if (newValue === undefined) {
      // TODO clear file input
    }
  }

  onChange (event) {
    const files = event.target.files;
    console.log(files);
    console.log(files.length);
    console.log(files[0].name);
    // this.context.onChange({ [this.field.name]: checked });
  }
}
</script>
