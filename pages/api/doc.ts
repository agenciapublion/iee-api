import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  openApiVersion: '3.0.0',
  title: 'IEE Api',
  version: '0.1.0',
});
export default swaggerHandler();
