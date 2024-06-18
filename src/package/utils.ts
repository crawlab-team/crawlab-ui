import { ComponentOptionsMixin } from 'vue';

export const mapElements = (elements: any) => {
  return Object.keys(elements).map(
    name => [name, elements[name]] as [string, ComponentOptionsMixin]
  );
};

export const importStylesheets = () => {
  import('normalize.css/normalize.css');
  import('element-plus/theme-chalk/index.css');
  import('@/styles/index.scss');
};
