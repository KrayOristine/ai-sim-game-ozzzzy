/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('postcss-nested'),
    require('postcss-remove-nested-calc'),
    require('cssnano')({
        preset: ["advanced",{
            "discardComments": {
                "removeAll": true,
            }
        }]
    }),
  ]
}

module.exports = config