// 非生产环境，包括 bbit/sit/uat 等
import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    'process.env': process.env,
    API_SERVER: '/afsfront-api',
    KKFILE_SERVER: 'http://100.69.40.48:8012',
    APP_CODE: 'afsfront',
  },
  devtool: 'source-map',
});
