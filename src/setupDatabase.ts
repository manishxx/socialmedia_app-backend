import mongoose, { Mongoose } from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';
const log: Logger = config.createLogger('setUpDatabase');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)

      .then(() => {
        log.info('Successfully connected to database');
      })
      .catch((error) => {
        log.error('Error in Database', error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
