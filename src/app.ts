import express, { Express } from 'express';
import { ChattyServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from './config';

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    this.loadConfig();
    server.start();
  }
  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}
const application = new Application();
application.initialize();
