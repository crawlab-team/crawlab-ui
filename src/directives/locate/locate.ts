import type { Directive } from 'vue';

const locate: Directive = {
  mounted(el, binding) {
    if (binding.value) {
      el.setAttribute('data-test', binding.value);
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.setAttribute('data-test', binding.value);
    } else {
      el.removeAttribute('data-test');
    }
  },
};

export default locate;
