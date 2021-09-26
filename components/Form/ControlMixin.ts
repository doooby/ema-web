import { FormField } from '.';

const ControlMixin = {
  computed: {
    labelTranslation () {
      const anyThis = this as any;
      const { name, options } = anyThis.field as FormField;
      if (!options.label) {
        const key = anyThis.context.fieldLabelKey(name);
        return String(anyThis.$t(key));
      }
      if (typeof options.label === 'function') return options.label();
      return String(options.label);
    },
    domIdBase () {
      const anyThis = this as any;
      return anyThis.context.namePrefix((anyThis.field as FormField).name);
    },
  },
};

export default ControlMixin;
