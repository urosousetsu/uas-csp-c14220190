module.exports = {
  extends: 'next/core-web-vitals',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', 
    '@typescript-eslint/no-unused-vars': 'off',
  },
  // This ensures these rules are applied to all files
  ignorePatterns: ['!**/*'],
  root: true
};