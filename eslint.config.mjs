// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Downgrade to warn — requires large refactor of entire codebase
      '@angular-eslint/prefer-inject': 'warn',
      // Downgrade to warn — existing code uses any types
      '@typescript-eslint/no-explicit-any': 'warn',
      // Downgrade to warn — existing code has unused vars
      '@typescript-eslint/no-unused-vars': 'warn',
      // Downgrade to warn — existing code uses wrapper object types
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      // Downgrade to warn — entire project uses NgModule pattern, standalone migration is separate
      '@angular-eslint/prefer-standalone': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Downgrade accessibility rules to warn — existing templates not updated yet
      '@angular-eslint/template/alt-text': 'warn',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'warn',
    },
  },
);
