const editor: LComponentsEditor = {
  models: {
    link: '链接',
    table: '表格',
    image: '图片',
    variable: '变量',
  },
  actions: {
    insert: '插入',
  },
  toolbar: {
    history: {
      undo: '撤销',
      redo: '重做',
    },
    format: {
      bold: '加粗',
      italic: '斜体',
      underline: '下划线',
      strikethrough: '删除线',
    },
    insert: {
      link: '插入链接',
      table: '插入表格',
      image: '插入图片',
      variable: '插入变量',
    },
    block: {
      code: '代码',
      h1: '标题 1',
      h2: '标题 2',
      h3: '标题 3',
      h4: '标题 4',
      h5: '标题 5',
      ol: '有序列表',
      ul: '无序列表',
      paragraph: '普通文本',
      quote: '引用',
    },
  },
};

export default editor;
