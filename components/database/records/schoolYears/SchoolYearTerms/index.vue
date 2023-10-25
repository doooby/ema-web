<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <term-row
      v-for="(term, index) in terms"
      :key="index"
      :index="index"
      :term="term"
      @change="onRowChange(index, $event)"
    />
    <div>
      <btn-mini variant="primary" icon="plus" @click="onAddTerm" />
      <btn-mini variant="secondary" icon="x" @click="onRemoveLastTerm" />
    </div>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';
import TermRow from './TermRow.vue';

export interface Term {
  from: undefined | Date;
  to: undefined | Date;
}

@Component({
  mixins: [ ControlMixin ],
  components: { TermRow },
})
export default class SchoolYearTerms extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name }, values, params) {
      params[name] = (values[name] ?? []).map((term: Term) => ({
        from: utils.dateToParam(term.from),
        to: utils.dateToParam(term.to),
      }));
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get terms (): Term[] {
    return this.formValues[this.field.name] ?? [];
  }

  onRowChange (index: number, term: Term) {
    const newTerms = [ ...this.terms ];
    newTerms[index] = term;
    this.context.onChange({ [this.field.name]: newTerms });
  }

  onAddTerm () {
    this.context.onChange({ [this.field.name]: [ ...this.terms, {} ] });
  }

  onRemoveLastTerm () {
    const newTerms = [ ...this.terms ];
    newTerms.pop();
    this.context.onChange({ [this.field.name]: newTerms });
  }
}
</script>
