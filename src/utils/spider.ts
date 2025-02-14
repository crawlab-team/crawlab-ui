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
          cmd: 'scrapy crawl quotes',
          icon: ['svg', 'scrapy'],
          doc_url: 'https://docs.scrapy.org/en/latest/intro/overview.html',
          doc_label: 'Scrapy Documentation',
        },
        {
          name: 'scrapy-redis',
          label: 'Scrapy Redis',
          cmd: 'scrapy crawl quotes',
          icon: ['svg', 'redis'],
          doc_url: 'https://github.com/rmax/scrapy-redis',
          doc_label: 'Scrapy Redis Documentation',
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
          name: 'drission-page',
          label: 'DrissionPage',
          icon: ['svg', 'drission-page'],
          cmd: 'python main.py',
          doc_url: 'https://drissionpage.cn/',
          doc_label: 'DrissionPage Documentation',
        },
        {
          name: 'pyppeteer',
          label: 'Pyppeteer',
          icon: ['svg', 'puppeteer'],
          cmd: 'python main.py',
          doc_url: 'https://miyakogi.github.io/pyppeteer/',
          doc_label: 'Pyppeteer Documentation',
        },
        // Disabled crawlee-python for now
        // {
        //   name: 'crawlee-python',
        //   label: 'Crawlee Python',
        //   icon: ['svg', 'crawlee'],
        //   cmd: 'python main.py',
        //   doc_url: 'https://crawlee.dev/docs/quick-start/python',
        //   doc_label: 'Crawlee Python Documentation',
        // },
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
          name: 'cheerio',
          label: 'Cheerio',
          icon: ['svg', 'cheerio'],
          cmd: 'node main.js',
          doc_url: 'https://cheerio.js.org/',
          doc_label: 'Cheerio Documentation',
        },
        {
          name: 'crawlee',
          label: 'Crawlee',
          icon: ['svg', 'crawlee'],
          cmd: 'node main.js',
          doc_url: 'https://crawlee.dev/',
          doc_label: 'Crawlee Documentation',
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
          name: 'goquery',
          label: 'GoQuery',
          icon: ['svg', 'go'],
          cmd: 'go run main.go',
          doc_url: 'https://github.com/PuerkitoBio/goquery',
          doc_label: 'GoQuery Documentation',
        },
      ],
    },
    {
      lang: 'java',
      label: 'Java',
      icon: ['fab', 'java'],
      templates: [
        {
          name: 'jsoup',
          label: 'Jsoup',
          icon: ['fab', 'java'],
          cmd: 'mvn clean compile exec:java',
          doc_url: 'https://jsoup.org/',
          doc_label: 'Jsoup Documentation',
        },
        {
          name: 'webmagic',
          label: 'Web Magic',
          icon: ['svg', 'webmagic'],
          cmd: 'mvn clean compile exec:java',
          doc_url: `https://webmagic.io/docs/${locale}`,
          doc_label: 'Web Magic Documentation',
        },
        {
          name: 'xxl-crawler',
          label: 'XXL-Crawler',
          icon: ['svg', 'xxl'],
          cmd: 'mvn clean compile exec:java',
          doc_url: 'https://www.xuxueli.com/xxl-crawler/',
          doc_label: 'XXL-Crawler Documentation',
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
