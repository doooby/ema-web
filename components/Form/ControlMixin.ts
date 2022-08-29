import { FormField } from '.';
import debounce from 'lodash/debounce';

const ControlMixin = {
  computed: {
    interactive () {
      const anyThis = this as any;
      return anyThis.field.options.interactive;
    },
    labelTranslation (): string {
      const anyThis = this as any;
      const { name, options } = anyThis.field as FormField;
      if (!options.label) return anyThis.context.fieldLabelKey(name);
      if (typeof options.label === 'function') return options.label();
      return String(options.label);
    },
    domIdBase () {
      const anyThis = this as any;
      return anyThis.context.namePrefix((anyThis.field as FormField).name);
    },
    debouncedOnChange () {
      const anyThis = this as any;
      const handler = (values: any) => anyThis.context.onChange(values);
      if (!anyThis.interactive) return handler;

      let timeout = anyThis.interactive;
      if (timeout === true || isNaN(timeout)) timeout = 400;
      else if (timeout < 100) timeout = 100;
      return debounce(handler, timeout);
    },
  },
  methods: {
    onChangeValue (newValue: any) {
      const anyThis = this as any;
      anyThis.context.onChange({ [anyThis.field.name]: newValue });
    },
  },
};

export default ControlMixin;
