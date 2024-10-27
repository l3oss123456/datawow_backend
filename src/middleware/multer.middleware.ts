import { Injectable, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class MulterMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const upload = multer().any(); // `any()` will parse all form data fields
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }
}
