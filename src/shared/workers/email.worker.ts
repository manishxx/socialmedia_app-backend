import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';

import { mailTransport } from '@service/emails/mail-transport';
const log: Logger = config.createLogger('authworker');
class EmailWorker {
  async addNotificationEmail(job: Job, done: DoneCallback): Promise<void> {
    try {
      let { template, recieverEmail, subject } = job.data;

      let resi: string = Object.entries(job.data)[1][1] as string;
      let subi: string = Object.entries(job.data)[2][1] as string;
      let tempi: string = Object.entries(job.data)[0][1] as string;
      await mailTransport.sendEmail(resi, subi, tempi);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}
export const emailWorker: EmailWorker = new EmailWorker();
