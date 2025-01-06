import { getI18n } from '@/i18n';

export const getSpiderTemplateGroups = (): SpiderTemplateGroup[] => {
  const locale = getI18n().global.locale.value;
  return [
    {
      lang: 'python',
      label: 'Python',
      icon: ['fab', 'python'],
      templates: [
        {
          name: 'scrapy',
          label: 'Scrapy',
          cmd: 'scrapy crawl scrapy_spider',
          icon: ['svg', 'scrapy'],
          params: {
            spider_name: 'scrapy_spider',
            start_urls: 'http://example.com',
            domains: 'example.com',
          },
          doc_url: 'https://docs.scrapy.org/en/latest/intro/overview.html',
          doc_label: 'Scrapy Documentation',
        },
        {
          name: 'bs4',
          label: 'BeautifulSoup',
          icon: ['fa', 'leaf'],
          cmd: 'python main.py',
          doc_url: `https://www.crummy.com/software/BeautifulSoup/bs4/doc/`,
          doc_label: 'BeautifulSoup Documentation',
        },
        {
          name: 'selenium',
          label: 'Selenium',
          icon: ['svg', 'selenium'],
          cmd: 'python main.py',
          doc_url: `https://selenium-python.readthedocs.io/`,
          doc_label: 'Selenium Documentation',
        },
        {
          name: 'python',
          label: 'Basic Python',
          icon: ['fab', 'python'],
          cmd: 'python main.py',
          doc_url: `https://www.python.org/`,
          doc_label: 'Python Documentation',
        },
      ],
    },
    {
      lang: 'node',
      label: 'Node.js',
      icon: ['fab', 'node-js'],
      templates: [
        {
          name: 'puppeteer',
          label: 'Puppeteer',
          icon: ['svg', 'puppeteer'],
          cmd: 'node main.js',
          doc_url: `https://pptr.dev/`,
          doc_label: 'Puppeteer Documentation',
        },
        {
          name: 'playwright',
          label: 'Playwright',
          icon: ['svg', 'playwright'],
          cmd: 'node main.js',
          doc_url: `https://playwright.dev/`,
          doc_label: 'Playwright Documentation',
        },
        {
          name: 'node',
          label: 'Basic Node.js',
          icon: ['fab', 'node-js'],
          cmd: 'node main.js',
          doc_url: `https://nodejs.org/${locale === 'zh' ? 'zh-cn' : 'en'}/`,
          doc_label: 'Node.js Documentation',
        },
      ],
    },
    {
      lang: 'go',
      label: 'Go',
      icon: ['svg', 'go'],
      templates: [
        {
          name: 'colly',
          label: 'Colly',
          icon: ['svg', 'colly'],
          cmd: 'go run main.go',
          doc_url: `https://go-colly.org/`,
          doc_label: 'Go Colly Documentation',
        },
        {
          name: 'go',
          label: 'Basic Go',
          icon: ['svg', 'go'],
          cmd: 'go run main.go',
          doc_url: `https://go.dev/`,
          doc_label: 'Go Documentation',
        },
      ],
    },
    {
      lang: 'java',
      label: 'Java',
      templates: [
        {
          name: 'java',
          label: 'Basic Java',
          icon: ['fab', 'java'],
          cmd: 'mvn clean compile exec:java',
        },
      ],
    },
  ];
};

export const getSpiderTemplates = (): SpiderTemplate[] => {
  return getSpiderTemplateGroups().reduce(
    (acc: SpiderTemplate[], group: SpiderTemplateGroup) => {
      return acc.concat(group.templates);
    },
    []
  );
};
