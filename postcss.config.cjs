/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("postcss-nested"),
    require("cssnano")({
      preset: [
        "advanced",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};

module.exports = config;
