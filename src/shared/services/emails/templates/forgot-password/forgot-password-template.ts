import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
      username,
      resetLink,
      image_url: 'https://png.pngtree.com/element_our/20190528/ourmid/pngtree-black-lock-icon-image_1130364.jpg'
    });
  }
}
export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
