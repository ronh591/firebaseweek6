const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(remark|unified|bail|is-plain-obj|trough|vfile|unist-util-stringify-position|mdast-util-from-markdown|mdast-util-to-string|micromark|decode-named-character-reference|character-entities|mdast-util-to-hast|trim-lines|unist-util-position|unist-util-visit|unist-util-is|unist-util-generated|mdast-util-phrasing|hast-util-whitespace|remark-html|hast-util-to-html|html-void-elements|hast-util-from-mdast|property-information|stringify-entities|character-entities-html4|ccount|comma-separated-tokens|space-separated-tokens|zwitch|devlop|mdast-util-to-markdown|longest-streak|mdast-util-phrasing)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);
