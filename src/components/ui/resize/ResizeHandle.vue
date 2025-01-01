<script setup lang="ts">
import { computed, onMounted, ref, StyleValue } from 'vue';

const props = withDefaults(
  defineProps<{
    targetRef: HTMLElement;
    sizeKey?: string;
    direction?: 'horizontal' | 'vertical';
    position?: 'start' | 'end';
    width?: number;
    minSize?: number;
    maxSize?: number;
  }>(),
  {
    direction: 'vertical',
    width: 5,
    position: 'end',
    minSize: 180,
  }
);

const emit = defineEmits<{
  (e: 'size-change', size: number): void;
}>();

const style = computed<StyleValue>(() => {
  const { direction, width, position } = props;
  const baseStyle: StyleValue = {
    position: 'absolute',
    zIndex: 999,
  };

  if (direction === 'horizontal') {
    const positionValue = position === 'start' ? 'top' : 'bottom';
    return {
      ...baseStyle,
      height: `${width}px`,
      left: 0,
      [positionValue]: 0,
      width: '100%',
    };
  }
  const positionValue = position === 'start' ? 'left' : 'right';
  return {
    ...baseStyle,
    width: `${width}px`,
    top: 0,
    [positionValue]: 0,
    height: '100%',
  };
});

const isResizing = ref(false);
const initialSize = ref(0);
const startX = ref(0);
const startY = ref(0);

const initResize = (event: MouseEvent) => {
  event.preventDefault();
  const { targetRef, direction } = props;
  isResizing.value = true;
  initialSize.value =
    direction === 'horizontal'
      ? targetRef?.clientHeight || 0
      : targetRef?.clientWidth || 0;
  startX.value = event.clientX;
  startY.value = event.clientY;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
};

const resize = (event: MouseEvent) => {
  event.preventDefault();
  const { targetRef, direction, position } = props;
  if (isResizing.value && targetRef) {
    let delta;
    if (direction === 'horizontal') {
      delta =
        position === 'start'
          ? startY.value - event.clientY
          : event.clientY - startY.value;
    } else {
      delta =
        position === 'start'
          ? startX.value - event.clientX
          : event.clientX - startX.value;
    }
    const newSize = initialSize.value + delta;
    updateSize(newSize);
  }
};

const stopResize = () => {
  isResizing.value = false;
  saveSize();
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
};

const updateSize = (newSize: number) => {
  const { targetRef, minSize, maxSize, direction } = props;
  if (targetRef) {
    if (newSize < minSize) {
      newSize = minSize;
    } else if (typeof maxSize !== 'undefined' && newSize > maxSize) {
      newSize = maxSize;
    }
    targetRef.style.flex = `0 0 ${newSize}px`;
    if (direction === 'vertical') {
      targetRef.style.width = `${newSize}px`;
    } else {
      targetRef.style.height = `${newSize}px`;
    }
    emit('size-change', newSize);
  }
};

const loadSize = () => {
  const { targetRef, sizeKey } = props;
  if (!sizeKey) return;
  // Load the saved height from local storage
  const savedSize = localStorage.getItem(sizeKey);
  if (savedSize && targetRef) {
    const newSize = parseInt(savedSize, 10);
    updateSize(newSize);
  }
};

const saveSize = () => {
  const { targetRef, sizeKey } = props;
  if (!sizeKey) return;
  if (targetRef) {
    if (props.direction === 'vertical') {
      localStorage.setItem(sizeKey, targetRef.clientWidth.toString());
    } else {
      localStorage.setItem(sizeKey, targetRef.clientHeight.toString());
    }
  }
};

onMounted(() => {
  setTimeout(loadSize, 0);
});

defineOptions({ name: 'ClResizeHandle' });
</script>

<template>
  <div
    class="resize-handle"
    :class="[direction, position]"
    :style="style"
    @mousedown="initResize"
  />
</template>

<style scoped>
.resize-handle {
  background-color: transparent;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &.vertical {
    cursor: col-resize;
  }

  &.horizontal {
    cursor: row-resize;
  }
}
</style>
