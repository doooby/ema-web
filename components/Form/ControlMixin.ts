import { FormField } from '.';

const ControlMixin = {
  computed: {
    labelTranslation () {
      const anyThis = this as any;
      const [ name, , opts ] = anyThis.field as FormField;
      if (!opts?.label) {
        const key = anyThis.context.fieldLabelKey(name);
        return String(anyThis.$t(key));
      }
      if (typeof opts.label === 'function') return opts.label();
      return String(opts.label);
    },
    domIdBase () {
      const anyThis = this as any;
      return anyThis.context.namePrefix((anyThis.field as FormField)[0]);
    },
  },
};

export default ControlMixin;
