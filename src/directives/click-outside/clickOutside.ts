import { Directive } from 'vue';

const clickOutsideDirective: Directive = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      // Check that click was outside the element
      if (!(el == event.target || el.contains(event.target))) {
        // If yes, call method provided in attribute value
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default clickOutsideDirective;
