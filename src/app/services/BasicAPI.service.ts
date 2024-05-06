export default class CommerceAPIService {
  private env: ImportMetaEnv;

  constructor() {
    this.env = import.meta.env;
  }

  public async getToken(): Promise<Response> {
    const resp = await fetch(
      `${this.env.VITE_CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.env.VITE_CTP_CLIENT_ID}:${this.env.VITE_CTP_CLIENT_SECRET}`)}`,
        },
      },
    );
    return resp.json();
  }
}
