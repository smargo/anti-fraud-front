/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

// 从环境变量读取API服务器地址，如果没有则使用默认值
const getApiServerUrl = () => {
  // 优先从环境变量读取
  const envApiServer = process.env.VITE_API_SERVER || process.env.API_SERVER;

  if (envApiServer) {
    console.log(`[Proxy Config] Using API server from environment: ${envApiServer}`);
    return envApiServer;
  }

  // 默认配置
  const defaultApiServer = 'http://localhost:8080';
  console.log(`[Proxy Config] Using default API server: ${defaultApiServer}`);
  return defaultApiServer;
};

// 从环境变量读取KKFILE服务器地址，如果没有则使用默认值
const getKkfileServerUrl = () => {
  // 优先从环境变量读取
  const envKkfileServer = process.env.VITE_KKFILE_SERVER || process.env.KKFILE_SERVER;

  if (envKkfileServer) {
    console.log(`[Proxy Config] Using KKFILE server from environment: ${envKkfileServer}`);
    return envKkfileServer;
  }

  // 默认配置
  const defaultKkfileServer = 'http://100.69.40.48:8012';
  console.log(`[Proxy Config] Using default KKFILE server: ${defaultKkfileServer}`);
  return defaultKkfileServer;
};

export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  // dev: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     // 要代理的地址
  //     target: 'https://preview.pro.ant.design',
  //     // 配置了这个可以从 http 代理到 https
  //     // 依赖 origin 的功能可能需要这个，比如 cookie
  //     changeOrigin: true,
  //   },
  // },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  dev: {
    '/afsfront-api': {
      target: getApiServerUrl(),
      changeOrigin: true,
      pathRewrite: { '^/afsfront-api': '' },
    },
    '/kkfile-view': {
      target: getKkfileServerUrl(),
      changeOrigin: true,
      pathRewrite: { '^/kkfile-view': '' },
    },
  },
  pre: {
    // '/api/': {
    //   target: 'your pre url',
    //   changeOrigin: true,
    //   pathRewrite: { '^': '' },
    // },
  },
};
