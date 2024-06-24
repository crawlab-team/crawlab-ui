import { ComponentOptionsMixin } from 'vue';

export const mapElements = (elements: any) => {
  return Object.keys(elements).map(
    name => [name, elements[name]] as [string, ComponentOptionsMixin]
  );
};
