import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class StringService {
  generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }
}
