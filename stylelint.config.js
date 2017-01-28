module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'selector-pseudo-element-colon-notation': 'single',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'global',
        ],
      },
    ],
    'block-no-empty': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'composes',
        ],
      },
    ],
    'declaration-empty-line-before': null,
    'rule-nested-empty-line-before': null,
    'custom-property-empty-line-before': null,
  }
}
