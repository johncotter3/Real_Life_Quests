import eslintPluginReact from 'eslint-plugin-react';
import babelParser from '@babel/eslint-parser';

export default [
  {
    ignores: ['node_modules/**', 'build/**', 'web-build/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: false
        },
        requireConfigFile: false
      }
    },
    plugins: { react: eslintPluginReact },
    rules: {}
  }
];
