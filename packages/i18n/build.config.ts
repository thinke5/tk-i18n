import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  failOnWarn: false,
  entries: ['src/index', 'src/cli'],
  outDir: 'libs',
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },

  externals: [],
});
