import {
  AuthApi,
  Configuration,
  ConfigurationParameters,
  S3Api,
} from "@bonusx/cloud-storage-dashboard-api-client";

class ApiService {
  public s3!: S3Api;
  public auth!: AuthApi;

  private config: ConfigurationParameters = {
    basePath: import.meta.env.PUBLIC_API_URL ?? "http://localhost:3000",
  };

  constructor() {
    this.initClients();
  }

  initClients() {
    const configObj = new Configuration(this.config);

    this.s3 = new S3Api(configObj);
    this.auth = new AuthApi(configObj);
  }

  setToken(token: string | null) {
    if (token) {
      this.config.headers = {
        ...this.config.headers,
        Authorization: "Bearer " + token,
      };
    } else {
      if (this.config.headers) {
        delete this.config.headers.Authorization;
      }
    }

    this.initClients();
  }
}

export const apiService = new ApiService();
