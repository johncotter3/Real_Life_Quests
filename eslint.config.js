import eslintPluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/**', 'build/**', 'web-build/**']
  },
  {
    files: ['**/*.js'],
    parser: '@babel/eslint-parser',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: { react: eslintPluginReact },
    rules: {}
  }
];

