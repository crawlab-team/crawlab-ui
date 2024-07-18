<script setup lang="ts">
import { LexicalEditor } from 'lexical';
import useList from '../composables/useLexicalList';

const props = defineProps<{
  editor: LexicalEditor;
}>();

useList(props.editor);

defineOptions({ name: 'ClLexicalListPlugin' });
</script>

<template />
