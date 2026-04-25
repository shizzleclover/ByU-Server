import { Resend } from 'resend';
import { env } from './env';

/**
 * Pre-configured Resend client instance.
 */
export const resend = new Resend(env.RESEND_API_KEY);
