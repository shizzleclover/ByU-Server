import { resend } from '../../config/resend';
import { env } from '../../config/env';
import { getOtpEmailHtml } from './templates/otp';
import { getWelcomeEmailHtml } from './templates/welcome';
import { getConnectionInterestHtml } from './templates/connection';

/**
 * Send an OTP verification email.
 */
export const sendOtpEmail = async (
  to: string,
  name: string,
  otp: string
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: `${otp} — Your ByU Connect verification code`,
    html: getOtpEmailHtml(name, otp),
  });

  if (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send a welcome email after successful verification.
 */
export const sendWelcomeEmail = async (
  to: string,
  name: string
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: 'Welcome to ByU Connect! 🎉',
    html: getWelcomeEmailHtml(name),
  });

  if (error) {
    console.error('⚠️  Failed to send welcome email:', error);
    // Non-critical — don't throw
  }
};

/**
 * Send a password reset OTP email.
 */
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  otp: string
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: `${otp} — Reset your ByU Connect password`,
    html: getOtpEmailHtml(name, otp, true),
  });

  if (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send an email alert for connection interest.
 */
export const sendConnectionInterestEmail = async (
  to: string,
  talentName: string,
  interestedUserName: string
): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: 'Someone is interested in your talent! 🚀',
    html: getConnectionInterestHtml(talentName, interestedUserName),
  });

  if (error) {
    console.error('⚠️  Failed to send connection interest email:', error);
  }
};
