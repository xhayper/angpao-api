import { InvalidVoucherUrlError } from './error/invalidVoucherUrl';
import { URL } from 'node:url';
import axios from 'axios';

const baseApiUrl = 'https://gift.truemoney.com/campaign/vouchers';

export type TruemoneyResponse<T> = {
  status: {
    message: string;
    code: string;
  };
  data: T;
};

export type StatusResponse = {
  message: string;
  code: string;
};

export type RawTicket = {
  mobile: string;
  update_date: string;
  amount_baht: string;
  full_name: string;
};

export type RawResponse = TruemoneyResponse<{
  voucher: {
    voucher_id: string;
    amount_baht: string;
    redeemed_amount_baht: string;
    member: number;
    status: string;
    link: string;
    detail: string;
    expire_date: number;
    redeemed: number;
    available: number;
  };
  owner_profile: {
    full_name: string;
  };
  redeemer_profile: {
    mobile_number: string;
  };
  my_ticket: RawTicket;
  tickets: RawTicket[];
}>;

export class AngpaoAPI {
  constructor(
    public phoneNumber: string,
    public userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'
  ) {}

  async verify(voucherId: string): Promise<RawResponse> {
    const requestUrl = `${baseApiUrl}/${voucherId}/verify?mobile=${this.phoneNumber}`;

    const response = await axios(requestUrl, {
      headers: {
        'User-Agent': this.userAgent,
        'Content-Type': 'application/json'
      }
    }).catch((err) => ({
      error: err as Error,
      code: err.code,
      data: err.response.data,
      body: err.response.body
    }));

    if (typeof response.data !== 'object') throw (response as any).error;

    switch (response.data.status.code) {
      case 'VOUCHER_NOT_FOUND':
        throw new Error('Voucher not found');
      case 'TARGET_USER_NOT_FOUND':
        throw new Error('Invalid phone number');
      case 'CANNOT_GET_OWN_VOUCHER':
        throw new Error('Cannot get own voucher');
    }

    return response.data;
  }

  async redeem(voucherId: string): Promise<RawResponse> {
    await this.verify(voucherId);

    const requestUrl = `${baseApiUrl}/${voucherId}/redeem`;

    const response = await axios(requestUrl, {
      method: 'POST',
      headers: {
        'User-Agent': this.userAgent
      },
      data: {
        mobile: this.phoneNumber,
        voucher_hash: voucherId
      }
    }).catch((err) => ({
      error: err as Error,
      code: err.code,
      data: err.response.data,
      body: err.response.body
    }));

    if (typeof response.data !== 'object') throw (response as any).error;

    switch (response.data.status.code) {
      case 'VOUCHER_OUT_OF_STOCK':
        throw new Error('Voucher out of stock');
      case 'VOUCHER_EXPIRED':
        throw new Error('Voucher expired');
      case 'TARGET_USER_REDEEMED':
        throw new Error('Target user redeemed');
    }

    return response.data;
  }

  static extractVoucherId(voucherUrl: string): string {
    const urlObj = new URL(voucherUrl);

    if (urlObj.hostname !== 'gift.truemoney.com') throw new InvalidVoucherUrlError();

    if (urlObj.pathname !== '/campaign' && urlObj.pathname !== '/campaign/') throw new InvalidVoucherUrlError();

    const voucherId = urlObj.searchParams.get('v') ?? '';

    if (!/^[a-z0-9]{35}$/gi.test(voucherId)) throw new InvalidVoucherUrlError();

    return voucherId;
  }
}

export { InvalidVoucherUrlError };
