module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'arrow-body-style': 0,
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-empty-pattern': 1,
    'no-extra-parens': 0,
    'no-case-declarations': 0,
    'no-unused-vars': 1,
    'no-console': 0,
    'react/prop-types': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-closing-bracket-location': 0,
    'max-len': [
      "error",
      {
        code: 120,
      }
    ],
    semi: [
      2,
      "never",
    ],
  },
}
