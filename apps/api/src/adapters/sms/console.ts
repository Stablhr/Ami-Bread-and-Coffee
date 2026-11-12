export interface SmsAdapter {
  sendOtp(destination: string, code: string): Promise<void>;
}

export const consoleSmsAdapter: SmsAdapter = {
  async sendOtp(destination, code) {
    // eslint-disable-next-line no-console
    console.log(`[SMS] OTP for ${destination}: ${code} (expires in 10 minutes)`);
  }
};
