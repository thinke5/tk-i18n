import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  failOnWarn: false,
  entries: [
    'src/index',
    'src/cli',
    {
      builder: 'mkdist',
      input: './src/files',
      outDir: './libs/files',
    },
  ],

  outDir: 'libs',
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },

  externals: [],
});
