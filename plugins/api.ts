import { Context } from '@nuxt/types';
import { ApiPlugin } from '@/lib/api';

export default (context: Context, inject: (key: string, value: any) => void) => {
  inject('api', ApiPlugin.createSingleton(context));
};
