const interceptor = (name) => {
  return `import Axios from 'axios-observable';
import Axios1 from 'axios';

const onRequest = (config: any) => {
  return config;
};

/** Interceptors */
const intercept = () => {
  Axios.interceptors.request.use(onRequest);
  Axios1.interceptors.request.use(onRequest);
};

export default intercept;
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  interceptorTemplate: interceptor
}
