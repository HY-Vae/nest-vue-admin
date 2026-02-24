import { Global, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheModeEnum } from '@/common/enums/config.enum';
import { HttpExceptionFilter } from '@/common/filters/exception.filter';
import { JwtAuthGuard } from '@/common/guards/jwtAuth.guard';
import { ActionInterceptor } from '@/common/interceptors/action.interceptor';
import { CacheConfigType, RedisConfigType } from '@/common/types/config.type';
import { getConfig } from '@/config/config';
import { envValidationSchema } from '@/config/config.validation';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheableMemory } from 'cacheable';
import Keyv, { KeyvStoreAdapter } from 'keyv';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionGuard } from './guards/permission.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { PrismaConfigService } from './prismaService/prismaConfigService';

@Global()
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConfig],
      validationSchema: envValidationSchema,
    }),
    // prisma 模块
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const stores: (KeyvStoreAdapter | Keyv)[] = [];
        const cacheConfig = configService.get<CacheConfigType>('cache')!;

        if (cacheConfig.mode === CacheModeEnum.REDIS) {
          const redisConfig = configService.get<RedisConfigType>('redis')!;
          const { host, port, password, username, database } = redisConfig;
          const redisStore = new KeyvRedis(
            {
              socket: {
                host,
                port,
                reconnectStrategy: (retries: number) => {
                  if (retries > 5) {
                    throw new Error('Redis connection failed');
                  }
                  return 1000;
                },
              },
              username,
              password,
              database,
            },
            {
              throwOnConnectError: true,
              throwOnErrors: true,
              connectionTimeout: 3000,
            },
          );
          const client = redisStore.client;
          client
            .connect()
            .then(() => {
              console.log('Redis connected successfully');
            })
            .catch((error) => {
              console.error('Redis connection failed:', error);
            });
          stores.push(redisStore);
        } else {
          const memoryStore = new Keyv({
            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
          });
          console.log('cache is using Memory Cache');
          stores.push(memoryStore);
        }

        return {
          stores,
          ttl: cacheConfig.ttl,
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ActionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class CommonModule {}
