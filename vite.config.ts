import { resolve } from 'path';
import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    build: {
      lib: {
        name: 'crawlab-ui',
        entry: resolve(__dirname, 'src/index.ts'),
        fileName: 'crawlab-ui',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: [
          'vue',
          'vue-router',
          'vue-i18n',
          'vuex',
          'axios',
          'element-plus',
          'element-plus/es/locale/lang/en',
          'element-plus/es/locale/lang/zh-cn',
          '@element/icons',
          '@fortawesome/fontawesome-svg-core',
          '@fortawesome/free-brands-svg-icons',
          '@fortawesome/free-regular-svg-icons',
          '@fortawesome/free-solid-svg-icons',
          '@fortawesome/vue-fontawesome',
          'atom-material-icons',
          'monaco-editor',
          'chart.js',
          'cron-parser',
          'pinyin',
          'humanize-duration',
          'dayjs',
          'cronstrue/i18n',
          'javascript-time-ago',
          'javascript-time-ago/locale/en',
          'javascript-time-ago/locale/zh',
          'clipboard',
        ],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'vue-i18n': 'VueI18n',
            vuex: 'Vuex',
            axios: 'axios',
            'element-plus': 'ElementPlus',
            '@element/icons-vue': 'ElementIconsVue',
            '@fortawesome/fontawesome-svg-core': 'FontAwesomeSvgCore',
            '@fortawesome/free-brands-svg-icons': 'FontAwesomeBrandsSvgIcons',
            '@fortawesome/free-regular-svg-icons': 'FontAwesomeRegularSvgIcons',
            '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolidSvgIcons',
            '@fortawesome/vue-fontawesome': 'FontAwesomeVue',
            'atom-material-icons': 'AtomMaterialIcons',
            'monaco-editor': 'monaco-editor',
            'chart.js': 'ChartJS',
            'cron-parser': 'cronParser',
            pinyin: 'pinyin',
            'humanize-duration': 'humanizeDuration',
            dayjs: 'dayjs',
            'cronstrue/i18n': 'cronstrueI18n',
            'javascript-time-ago': 'javascriptTimeAgo',
            'javascript-time-ago/locale/en': 'javascriptTimeAgoLocaleEn',
            'javascript-time-ago/locale/zh': 'javascriptTimeAgoLocaleZh',
            'element-plus/es/locale/lang/en': 'elementPlusLocaleEn',
            'element-plus/es/locale/lang/zh-cn': 'elementPlusLocaleZh',
            clipboard: 'ClipboardJS',
          },
        },
      },
    },
    optimizeDeps: {
      include: ['element-plus', 'monaco-editor'],
    },
    resolve: {
      dedupe: ['vue', 'vue-router', 'vuex', 'axios', 'element-plus'],
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    plugins: [
      vue(),
      // @ts-ignore
      dynamicImport(),
      vueJsx(),
      // @ts-ignore
      svgLoader(),
    ],
    server: {
      cors: true,
    },
  };

  if (mode === 'analyze') {
    // @ts-ignore
    config.plugins.push(visualizer({ open: true, gzipSize: true }));
  } else if (mode === 'development') {
    config.build.watch = {
      include: ['src/**', 'public', 'index.html'],
    };
  }

  return config;
});
