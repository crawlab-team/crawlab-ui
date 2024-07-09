<script setup lang="ts">
import { type LexicalEditor } from 'lexical';
import useVariableSetup from '@/components/lexical/composables/useVariableSetup';
import useMounted from '@/components/lexical/composables/useMounted';
import invariant from 'tiny-invariant';
import { VariableNode } from '@/components/lexical/nodes/VariableNode';

const props = defineProps<{
  editor: LexicalEditor;
}>();

useMounted(() => {
  const { editor } = props;
  if (!editor.hasNodes([VariableNode])) {
    invariant(false, 'VariablePlugin: VariableNode not registered on editor');
  }
  return useVariableSetup(editor);
});

defineOptions({ name: 'ClLexicalVariablePlugin' });
</script>

<template>
  <el-popover v-model:visible="visible" placement="bottom" width="300">
    <template #reference>
      <div class="typehead-menu"></div>
    </template>
  </el-popover>
</template>

<style scoped lang="scss"></style>
