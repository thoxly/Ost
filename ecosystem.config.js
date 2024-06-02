module.exports = {
    apps: [
      {
        name: 'server',
        script: './src/server.js',
        env: {
          NODE_ENV: 'development',
          ELMA_API_TOKEN: process.env.ELMA_API_TOKEN,
          JWT_SECRET: process.env.JWT_SECRET,
        },
        env_production: {
          NODE_ENV: 'production',
          ELMA_API_TOKEN: process.env.ELMA_API_TOKEN,
          JWT_SECRET: process.env.JWT_SECRET,
        }
      }
    ]
  };
  