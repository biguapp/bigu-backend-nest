import { Resend } from 'resend';

const resend = new Resend('re_Nukcfmn7_7GsfZHBufESb93bfBUEx9ME1');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'biguapp@hotmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});