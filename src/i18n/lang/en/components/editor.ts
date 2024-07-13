const editor: LComponentsEditor = {
  models: {
    link: 'Link',
    table: 'Table',
    image: 'Image',
    variable: 'Variable',
  },
  actions: {
    insert: 'Insert',
  },
  toolbar: {
    history: {
      undo: 'Undo',
      redo: 'Redo',
    },
    format: {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
    },
    insert: {
      link: 'Insert Link',
      table: 'Insert Table',
      image: 'Insert Image',
      variable: 'Insert Variable',
    },
    block: {
      code: 'Code',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      h4: 'Heading 4',
      h5: 'Heading 5',
      ol: 'Ordered List',
      ul: 'Unordered List',
      paragraph: 'Normal',
      quote: 'Quote',
    },
  },
};

export default editor;
