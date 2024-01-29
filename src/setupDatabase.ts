// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { Mongoose } from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';
const log: Logger = config.createLogger('setUpDatabase');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)

      .then(() => {
        log.info('Successfully connected to database');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('Error in Database', error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
