import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import { visualizer } from 'rollup-plugin-visualizer';

const plugins = [vue(), dynamicImport()];
if (process.env.NODE_ENV === 'analyze') {
  plugins.push(visualizer({ open: true, gzipSize: true }));
}

const config = defineConfig({
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
        '@element/icons',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        'echarts',
        'atom-material-icons',
        'monaco-editor',
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
          '@element/vue-icons': 'ElementVueIcons',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeSvgCore',
          '@fortawesome/free-brands-svg-icons': 'FontAwesomeBrandsSvgIcons',
          '@fortawesome/free-regular-svg-icons': 'FontAwesomeRegularSvgIcons',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolidSvgIcons',
          '@fortawesome/vue-fontawesome': 'FontAwesomeVue',
          echarts: 'Echarts',
          'atom-material-icons': 'AtomMaterialIcons',
          'monaco-editor': 'monaco-editor',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['element-plus', 'echarts', 'monaco-editor'],
  },
  resolve: {
    dedupe: ['vue', 'vue-router', 'vuex', 'axios', 'element-plus', 'echarts'],
    alias: {
      '@': resolve(__dirname, 'src'),
      echarts: 'echarts/dist/echarts.min.js',
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
  },
  plugins,
  server: {
    cors: true,
  },
});

if (process.env.NODE_ENV !== 'production') {
  config.build = {
    ...config.build,
    watch: {
      include: ['src/**', 'public', 'index.html'],
    },
  };
}

export default config;
