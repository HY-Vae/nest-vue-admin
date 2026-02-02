import { Transform, TransformFnParams } from 'class-transformer';

// 定义参数接口
export interface TrimOptions {
  /**
   * 去除空格的策略
   * - 'both': 去除两端空格 (默认)
   * - 'left': 仅去除左边空格 (start)
   * - 'right': 仅去除右边空格 (end)
   */
  strategy?: 'both' | 'left' | 'right';
}

/**
 * 字符串去空格装饰器 (基于 class-transformer)
 *
 * @remarks
 * 该装饰器在 DTO 转换（Transform）阶段自动执行。
 * - **智能兼容**：自动判断输入是 `string` 还是 `string[]`。
 * - **数组支持**：若值为数组，会自动递归处理数组中的每一项。
 * - **安全兜底**：若值为非字符串（如 null, number），原样返回，不会报错。
 *
 * @param options - [可选] 配置对象
 * @param options.strategy - 去除策略：`'both'`(默认) | `'left'` | `'right'`
 *
 * @example
 * ```ts
 * // 1. 默认用法 (去除两端空格)
 * @Trim()
 * title: string;
 *
 * // 2. 指定策略 (只去左边)
 * @Trim({ strategy: 'left' })
 * content: string;
 *
 * // 3. 数组支持 (自动 Trim 每一项)
 * @Trim()
 * tags: string[];
 * ```
 */
export function Trim(options?: TrimOptions) {
  const strategy = options?.strategy || 'both';

  const applyTrim = (value: string): string => {
    switch (strategy) {
      case 'left':
        return value.trimStart();
      case 'right':
        return value.trimEnd();
      default:
        return value.trim();
    }
  };

  return Transform(({ value }: TransformFnParams) => {
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? applyTrim(v) : v));
    }

    if (typeof value === 'string') {
      return applyTrim(value);
    }

    return value;
  });
}
