<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import { computed, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';

const { t } = useI18n();

const props = defineProps<{
  message: ChatMessageType;
}>();

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        // Add data-language attribute to pre tag
        return (
          '<pre data-language="' +
          lang +
          '"><code class="hljs language-' +
          lang +
          '">' +
          hljs.highlight(str, { language: lang }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }
    // For unknown languages, still add the language if provided
    return lang
      ? '<pre data-language="' + lang + '"><code>' + str + '</code></pre>'
      : '';
  },
});

// Format timestamp
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Normalize content to prevent duplicate empty lines before rendering
const normalizeContent = (content: string): string => {
  return content;
  // Replace sequences of more than 2 newlines with just 2
  return (
    content
      .replace(/\n{3,}/g, '\n\n')
      // Ensure code blocks are properly spaced
      .replace(/```([a-z]*)\n{0,1}/g, '\n```$1\n')
  );
};

// Safe markdown rendering with sanitization
const renderMarkdown = (content: string): string => {
  // Normalize content first
  const normalizedContent = normalizeContent(content);
  // Convert to HTML
  const html = md.render(normalizedContent);
  // const html = converter.makeHtml(normalizedContent);
  return html;
  // Sanitize HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'br',
      'code',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      'span',
      'strong',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'ul',
      'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    FORBID_TAGS: ['style', 'script'],
  });
};

// Configure DOMPurify to add target="_blank" to links
DOMPurify.addHook('afterSanitizeAttributes', node => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Convert markdown to sanitized HTML
const messageContent = computed(() => {
  return renderMarkdown(props.message.content);
});

// For streaming messages, continuously update the rendered content
const streamContent = ref('');
const typing = ref(true);

watch(
  () => props.message.content,
  newContent => {
    if (props.message.isStreaming) {
      streamContent.value = renderMarkdown(newContent);
    }
  },
  { immediate: true }
);

// Stop the typing animation when streaming ends
watch(
  () => props.message.isStreaming,
  isStreaming => {
    typing.value = isStreaming === true;
  },
  { immediate: true }
);

defineOptions({ name: 'ClChatMessage' });
</script>

<template>
  <div :class="['message-container', message.role]">
    <div class="message-content">
      <!-- Display sanitized markdown HTML for both streaming and non-streaming content -->
      <template v-if="message.isStreaming">
        <div v-html="streamContent"></div>
        <span class="typing-indicator" v-if="typing">|</span>
      </template>
      <template v-else>
        <div v-html="messageContent"></div>
      </template>
    </div>
    <div class="message-time">
      <!-- Show 'Generating...' for streaming messages -->
      <template v-if="message.isStreaming">
        <span class="typing-text">{{
          t('components.ai.chatbot.generating')
        }}</span>
      </template>
      <template v-else>
        {{ formatTime(message.timestamp) }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  font-size: 14px;
  width: calc(100% - 24px);
  margin: 0 12px;
  padding: 12px;
  position: relative;
}

.message-container:first-child.user {
  margin-top: 12px;
}

.message-container.user {
  border-radius: 12px;
  background-color: var(--el-color-primary-dark-2);
}

.message-container.system {
  background-color: transparent;
}

.message-content {
  word-break: break-word;
  line-height: 1.5;
  max-height: 100%;
  overflow-y: auto;

  /* Firefox scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) var(--el-fill-color-lighter);

  /* Webkit scrollbar styles */
  &::-webkit-scrollbar {
    width: 7px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-darker);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
}

/* Add styles for markdown elements */
.message-content :deep(pre) {
  background-color: var(--el-fill-color-light);
  padding: 24px 12px 12px 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
  position: relative;
}

.message-content :deep(pre code) {
  /* Firefox scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) var(--el-fill-color-lighter);

  /* Webkit scrollbar styles */
  &::-webkit-scrollbar {
    height: 7px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-darker);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
}

/* Add language display */
.message-content :deep(pre[data-language]::before) {
  content: attr(data-language);
  position: absolute;
  top: 0;
  left: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color);
  padding: 2px 8px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-transform: lowercase;
}

.message-content :deep(pre code) {
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  display: block;
  padding: 0;
  background: none;
}

.message-content :deep(code:not(pre code)) {
  background-color: var(--el-fill-color-light);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.9em;
}

.message-content :deep(a) {
  color: var(--el-color-primary);
  text-decoration: none;
}

.message-content :deep(blockquote) {
  border-left: 4px solid var(--el-color-info-light-5);
  padding-left: 12px;
  margin-left: 0;
  color: var(--el-text-color-secondary);
}

.message-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.message-content :deep(th),
.message-content :deep(td) {
  border: 1px solid var(--el-border-color);
  padding: 8px;
  text-align: left;
}

.message-content :deep(th) {
  background-color: var(--el-color-info-light-9);
}

.message-content :deep(p) {
  margin: 0;
  padding: 0;
}

.message-content :deep(h1) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(h2) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(h3) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(h4) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(h5) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(h6) {
  margin: 0;
  padding: 12px 0;
}

.message-content :deep(ul) {
  margin: 0;
  padding-inline-start: 24px;
}

.message-content :deep(ol) {
  margin: 0;
  padding-inline-start: 24px;
}

.message-content :deep(li) {
  margin: 3px 0;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 6px;
}

.message-container.user .message-content {
  color: var(--el-color-white);
}

.message-container.user .message-time {
  color: var(--el-color-white);
}

.message-container.system .message-content {
  color: var(--el-text-color-regular);
}

.message-container.system .message-time {
  color: var(--el-text-color-regular);
}

.typing-indicator {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

.typing-text {
  display: inline-block;
  color: var(--el-color-primary);
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
