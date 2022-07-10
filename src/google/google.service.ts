import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import credentials from './credentials.json';
@Injectable()
export class GoogleService {
  private client;
  private SCOPES = [
    'https://www.googleapis.com/auth/script.deployments',
    'https://www.googleapis.com/auth/script.external_request',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
  ];
  constructor() {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    this.client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
  }

  async getUrl() {
    return this.client?.generateAuthUrl({
      scope: this.SCOPES,
    });
  }

  async exchangeCodeForToken(code: string) {
    let { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
    console.log(tokens);
    return tokens;
  }
}
