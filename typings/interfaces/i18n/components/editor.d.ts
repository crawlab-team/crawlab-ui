interface LComponentsEditor {
  models: {
    link: string;
    table: string;
    image: string;
    variable: string;
  };
  actions: {
    insert: string;
  };
  toolbar: {
    history: {
      undo: string;
      redo: string;
    };
    format: {
      bold: string;
      italic: string;
      underline: string;
      strikethrough: string;
    };
    block: {
      code: string;
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      ol: string;
      ul: string;
      paragraph: string;
      quote: string;
    };
    insert: {
      link: string;
      table: string;
      image: string;
      variable: string;
    };
  };
}
