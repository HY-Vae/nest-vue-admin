import { Injectable } from '@nestjs/common';
import { PrismaOptionsFactory, PrismaServiceOptions } from 'nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    const isDev = process.env.NODE_ENV === 'development';

    return {
      prismaOptions: {
        log: isDev
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'event', level: 'info' },
              { emit: 'event', level: 'warn' },
              { emit: 'event', level: 'error' },
            ]
          : [
              { emit: 'event', level: 'warn' },
              { emit: 'event', level: 'error' },
            ],
      },
      explicitConnect: true,
    };
  }
}
