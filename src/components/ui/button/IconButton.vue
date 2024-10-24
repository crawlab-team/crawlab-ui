<script setup lang="ts">

interface ButtonProps {
  tooltip?: string;
  type?: BasicType;
  size?: BasicSize;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  noMargin?: boolean;
}

defineProps<
  ButtonProps & {
    icon: string;
  }
>();
defineOptions({ name: 'ClIconButton' });
</script>

<template>
  <el-tooltip :content="tooltip ? tooltip : undefined">
    <div class="icon-button button">
      <cl-button
        :circle="circle"
        :disabled="disabled"
        :icon="icon"
        :plain="plain"
        :round="round"
        :size="size"
        :title="tooltip"
        :type="type"
        @click="() => $emit('click')"
      />
    </div>
  </el-tooltip>
</template>


<style scoped>
.icon-button {
  padding: 7px;
}

.icon-button:deep(.icon) {
  width: 20px;
}
</style>
