import {resolve} from 'path';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
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
        'simplemde',
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
          '@element/icons': 'ElementIcons',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeSvgCore',
          '@fortawesome/free-brands-svg-icons': 'FontAwesomeBrandsSvgIcons',
          '@fortawesome/free-regular-svg-icons': 'FontAwesomeRegularSvgIcons',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolidSvgIcons',
          '@fortawesome/vue-fontawesome': 'FontAwesomeVue',
          echarts: 'Echarts',
          'atom-material-icons': 'AtomMaterialIcons',
          'simplemde': 'SimpleMDE',
          'monaco-editor': 'monaco',
        }
      }
    },
  },
  resolve: {
    dedupe: ['vue'],
    alias: [
      {find: '@', replacement: resolve(__dirname, 'src')},
    ],
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue',
      '.scss',
    ]
  },
  optimizeDeps: {
    include: ['monaco-editor']
  },
  plugins: [
    vue(),
    dynamicImport(),
    visualizer({open: true}),
  ],
  server: {
    cors: true,
  },
});
