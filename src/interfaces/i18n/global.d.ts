export declare global {
  interface LGlobal {
    lang: string;
    edition: {
      community: string;
      pro: string;
      enterprise: string;
    };
    title: string;
    subTitle: string;
    upgrade: {
      pro: {
        label: string;
        tooltip: string;
      };
    };
    docs: string;
    github: {
      star: string;
    };
  }
}
