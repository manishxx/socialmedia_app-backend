import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,

      image_url: 'https://png.pngtree.com/element_our/20190528/ourmid/pngtree-black-lock-icon-image_1130364.jpg'
    });
  }
}
export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
