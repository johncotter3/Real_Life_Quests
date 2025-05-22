import eslintPluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/**', 'build/**', 'web-build/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: '@babel/eslint-parser',
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: { react: eslintPluginReact },
    rules: {}
  }
];

