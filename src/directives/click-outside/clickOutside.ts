import { Directive } from 'vue';

const clickOutsideDirective: Directive = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      // 这里检查点击是否发生在元素外部
      if (!(el == event.target || el.contains(event.target))) {
        // 如果是外部点击，则调用传入的回调函数
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
