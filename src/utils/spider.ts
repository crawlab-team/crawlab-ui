export const getSpiderTemplates = (): SpiderTemplate[] => {
  return [
    {
      name: 'scrapy',
      label: 'Scrapy',
      cmd: 'scrapy crawl scrapy_spider',
      params: {
        spider_name: 'scrapy_spider',
        start_urls: 'http://example.com',
        domains: 'example.com',
      },
    },
    {
      name: 'bs4',
      label: 'BeautifulSoup',
      cmd: 'python main.py',
    },
    {
      name: 'selenium',
      label: 'Selenium',
      cmd: 'python main.py',
    },
    {
      name: 'puppeteer',
      label: 'Puppeteer',
      cmd: 'node main.js',
    },
    {
      name: 'playwright',
      label: 'Playwright',
      cmd: 'node main.js',
    },
    {
      name: 'colly',
      label: 'Colly',
      cmd: 'go run main.go',
    },
    {
      name: 'python',
      label: 'Basic Python',
      cmd: 'python main.py',
    },
    {
      name: 'node',
      label: 'Basic Node.js',
      cmd: 'node main.js',
    },
    {
      name: 'go',
      label: 'Basic Go',
      cmd: 'go run main.go',
    },
    {
      name: 'java',
      label: 'Basic Java',
      cmd: 'mvn clean compile exec:java',
    },
  ];
};
