import { app } from './app';
import { env } from './env';

app.listen({
  port: env.PORT,
  host: env.HOST
}).then(() => {
  console.log(`http server is running on ${env.HOST}:${env.PORT}`);
});

