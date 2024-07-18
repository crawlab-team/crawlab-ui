<script setup lang="ts">
import { ref } from 'vue';
import type { LexicalEditor } from 'lexical';
import useMounted from '../composables/useLexicalMounted';

const props = withDefaults(
  defineProps<{
    editor: LexicalEditor;
    ariaActivedescendant?: string;
    ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
    ariaControls?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaMultiline?: boolean;
    ariaOwns?: string;
    ariaRequired?: boolean;
    autoCapitalize?: boolean;
    autoComplete?: boolean;
    autoCorrect?: boolean;
    id?: string;
    editable?: boolean;
    role?: string;
    spellcheck?: boolean;
    tabindex?: number;
    enableGrammarly?: boolean;
  }>(),
  {
    role: 'textbox',
    spellcheck: true,
  }
);
const root = ref<HTMLElement | null>(null);

const editable = ref(false);

useMounted(() => {
  const { editor } = props;
  if (root.value) {
    editor.setRootElement(root.value);
    editable.value = editor.isEditable();
  }

  return editor.registerEditableListener(currentIsEditable => {
    editable.value = currentIsEditable;
  });
});

defineOptions({ name: 'ClLexicalContentEditable' });
</script>

<template>
  <div
    :id="id"
    ref="root"
    :aria-activedescendant="!editable ? undefined : ariaActivedescendant"
    :aria-autocomplete="!editable ? undefined : ariaAutocomplete"
    :aria-controls="!editable ? undefined : ariaControls"
    :aria-describedby="ariaDescribedby"
    :aria-expanded="
      !editable
        ? undefined
        : role === 'combobox'
          ? !!ariaExpanded
            ? ariaExpanded
            : undefined
          : undefined
    "
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-multiline="ariaMultiline"
    :aria-owns="!editable ? undefined : ariaOwns"
    :aria-required="ariaRequired"
    :autocapitalize="`${autoCapitalize}`"
    :autocomplete="autoComplete"
    :autocorrect="`${autoCorrect}`"
    :contenteditable="editable"
    :role="!editable ? undefined : role"
    :spellcheck="spellcheck"
    :tabindex="tabindex"
  />
</template>
