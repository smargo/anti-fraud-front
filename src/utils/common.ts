import { message } from 'antd';
import dayjs from 'dayjs';
import { merge } from 'lodash';

/**
 * 通用工具函数类
 * 提供各种常用的工具函数
 */
export class CommonUtils {
  /**
   * 环境检测
   */
  static isDev = process.env.UMI_ENV === 'dev';
  static isLocal = process.env.UMI_ENV === 'local';
  static isLocalDevelopment = () => {
    const envCheck = process.env.UMI_ENV === 'local' || process.env.UMI_ENV === 'dev';
    const portalCheck = !(window.top && window.top !== window);
    const devModeCheck = process.env.NODE_ENV === 'development';
    return envCheck || (portalCheck && devModeCheck);
  };

  /**
   * 文件下载
   * @param blob Blob 对象
   * @param name 文件名
   */
  static downloadBlob(blob: Blob | MediaSource, name: string): void {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name || `${Math.random() * 10000}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 复制到剪贴板
   * @param text 要复制的文本
   */
  static copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
      });
  }

  /**
   * 获取静态资源路径
   * @param src 资源路径
   * @returns 处理后的资源路径
   */
  static getStaticSrc(src: string): string {
    if ((window as any).__POWERED_BY_QIANKUN__) {
      return (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + src.replace(/^\//, '');
    }
    return src;
  }

  /**
   * 数组查找（替代 lodash.find）
   * @param array 数组
   * @param predicate 判断函数
   * @returns 找到的元素或 undefined
   */
  static find<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    if (!Array.isArray(array)) return undefined;
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) return array[i];
    }
    return undefined;
  }

  /**
   * 过滤空字段
   * @param params 参数对象
   * @returns 过滤后的对象
   */
  static filterNullField(params: Record<string, any>): Record<string, any> {
    const values: Record<string, any> = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '') {
        values[key] = params[key];
      }
    });
    return values;
  }

  /**
   * 去除字段前后空格
   * @param params 参数对象
   * @returns 处理后的对象
   */
  static trimField(params: Record<string, any>): Record<string, any> {
    const processedParams = Object.keys(params).reduce((acc: Record<string, any>, key) => {
      const value = params[key];
      acc[key] = typeof value === 'string' ? value.trim() : value;
      return acc;
    }, {});
    return processedParams;
  }

  /**
   * 下拉框搜索过滤
   * @param input 输入值
   * @param option 选项
   * @returns 是否匹配
   */
  static filterOption(input: any, option: any): boolean {
    return (
      option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  /**
   * 树形搜索过滤
   * @param inputValue 输入值
   * @param treeNode 树节点
   * @returns 是否匹配
   */
  static filterTreeNode(inputValue: string, treeNode: any): boolean {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  }

  /**
   * 对象转下拉框选项（查询条件格式）
   * @param data 数据对象
   * @returns 选项对象
   */
  static adaptorDictionaryToEnum(data: Record<string, string>): Record<string, any> {
    const res: Record<string, any> = {};
    for (let item in data) {
      if (data.hasOwnProperty(item)) {
        res[item] = { text: data[item], status: '' };
      }
    }
    return res;
  }

  /**
   * 对象转下拉框选项（弹窗格式）
   * @param data 数据对象
   * @returns 选项数组
   */
  static adaptorDictionaryToSelect(
    data: Record<string, string>,
  ): Array<{ label: string; value: string }> {
    const res: Array<{ label: string; value: string }> = [];
    for (let item in data) {
      if (data.hasOwnProperty(item)) {
        res.push({
          label: data[item],
          value: item,
        });
      }
    }
    return res;
  }

  /**
   * 列表转下拉框选项
   * @param data 数据数组
   * @param valueField 值字段
   * @param labelField 标签字段
   * @returns 选项数组
   */
  static adaptorListToOptions(
    data: any[],
    valueField: string = 'value',
    labelField: string = 'label',
  ): Array<{ label: string; value: any }> {
    const res: Array<{ label: string; value: any }> = [];
    data.forEach((item: any) => {
      res.push({
        label: item[labelField],
        value: item[valueField],
      });
    });
    return res;
  }

  /**
   * 列表转枚举对象
   * @param data 数据数组
   * @param valueField 值字段
   * @param labelField 标签字段
   * @returns 枚举对象
   */
  static adaptorListToEnums(
    data: any[],
    valueField: string = 'value',
    labelField: string = 'label',
  ): Record<string, { text: string; status: string }> {
    const Enum: Record<string, { text: string; status: string }> = {};
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        Enum[item[valueField]] = {
          text: item[labelField] || '-',
          status: '',
        };
      });
    }
    return Enum;
  }

  /**
   * 列表转 Map 枚举
   * @param data 数据数组
   * @param valueField 值字段
   * @param labelField 标签字段
   * @returns Map 对象
   */
  static adaptorListToMapEnums<T extends Record<string, any>>(
    data: T[],
    valueField: keyof T = 'value',
    labelField: keyof T = 'label',
  ): Map<string, { text: string; status: string }> {
    const Enum: Map<string, { text: string; status: string }> = new Map();
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (
          item[valueField] !== undefined &&
          item[valueField] !== null &&
          item[valueField] !== '' &&
          item[labelField]
        ) {
          Enum.set(item[valueField], {
            text: item[labelField] ?? '',
            status: '',
          });
        } else {
          console.error(`${item} 字段格式不符合要求，该项被忽略`);
        }
      });
    } else {
      console.error(`调用 adaptorListToMapEnums 方法失败，${data} 不是数组`);
    }
    return Enum;
  }

  /**
   * 布尔字符串转换
   * @param data 数据
   * @param excludes 排除字段
   * @returns 转换后的数据
   */
  static convertBoolStr<T extends Record<string, any> | string, K extends keyof T>(
    data: T,
    excludes: K[] = [],
  ): T {
    let result = data;

    const convertFn = (str: string) => {
      return str === 'true' || str === 'false' ? JSON.parse(str) : str;
    };

    if (typeof data === 'string') {
      result = convertFn(data);
    }

    try {
      if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' && !excludes.includes(key as K)) {
            (result as Record<string, any>)[key] = convertFn(value);
          }
          if (Object.prototype.toString.call(value) === '[object Array]') {
            (result as Record<string, any>)[key] = value.map((item: any) =>
              this.convertBoolStr(item),
            );
          }
          if (Object.prototype.toString.call(value) === '[object Object]') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              (value as Record<string, any>)[subKey] = this.convertBoolStr(subValue as any);
            });
          }
        });
      }
    } catch (error) {
      console.error('convertBoolStr error: ', error);
    }

    return result;
  }

  /**
   * 布尔值转字符串
   * @param data 数据
   * @param excludes 排除字段
   * @returns 转换后的数据
   */
  static convertBoolToStr<T extends Record<string, any> | boolean, K extends keyof T>(
    data: T,
    excludes: K[] = [],
  ): T {
    let result = data;

    const convertFn = (val: boolean) => {
      return val === true || val === false ? val.toString() : val;
    };

    if (typeof data === 'boolean') {
      result = convertFn(data) as unknown as T;
    }

    try {
      if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'boolean' && !excludes.includes(key as K)) {
            (result as Record<string, any>)[key] = convertFn(value);
          }
          if (Object.prototype.toString.call(value) === '[object Array]') {
            (result as Record<string, any>)[key] = value.map((item: any) =>
              this.convertBoolToStr(item),
            );
          }
          if (Object.prototype.toString.call(value) === '[object Object]') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              (value as Record<string, any>)[subKey] = this.convertBoolToStr(subValue as any);
            });
          }
        });
      }
    } catch (error) {
      console.error('convertBoolToStr error: ', error);
    }

    return result;
  }

  /**
   * 数学运算 - 加法
   * @param args 数字参数
   * @returns 加法结果
   */
  static addNumbers(...args: (number | number[])[]): number {
    const flattenedArgs = args.flat();
    return flattenedArgs.reduce((acc, cur) => {
      return acc + Number(cur);
    }, 0);
  }

  /**
   * 更新对象中字段为 null 的值为 0
   * @param obj 对象
   * @param fields 字段数组
   */
  static updateFields(obj: any, fields: string[]): void {
    fields.forEach((field: string) => {
      if (obj[field] === null || obj[field] === undefined || obj[field] === '') {
        obj[field] = 0;
      }
    });
  }

  /**
   * 重置模型状态
   */
  static resetModelState(): void {
    localStorage.removeItem('Phoenix:token');
  }

  /**
   * 版本检测
   * @param setShowUpdateNotice 设置更新通知函数
   * @param setCount 设置倒计时函数
   */
  static async checkVersion(setShowUpdateNotice: any, setCount: any): Promise<void> {
    try {
      const cVersion = (document.querySelector('meta[name="version"]') as HTMLMetaElement)?.content;
      const res = await fetch(`/version.json?_t=${dayjs().valueOf()}`, { cache: 'no-cache' });
      const data = await res.json();
      const latestJson = data.version;
      if (parseInt(cVersion) && parseInt(cVersion) !== latestJson) {
        console.log('检测到新版本');
        console.log(
          '当前版本发版时间：',
          dayjs(parseInt(cVersion)).format(),
          '新版本发版时间：',
          dayjs(parseInt(latestJson)).format(),
        );
        setShowUpdateNotice(true);
        let count = 5;
        setCount(count);
        const timer = setInterval(() => {
          count -= 1;
          setCount(count);
          if (count <= 0) {
            clearInterval(timer);
            window.location.reload();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('检测版本失败：', error);
    }
  }

  /**
   * 获取错误消息
   * @param error 错误对象
   * @returns 错误消息字符串
   */
  static getErrorMessage(error: any): string {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as any;
      if (
        axiosError.code === 'ERR_BAD_RESPONSE' &&
        axiosError.response?.status === 500 &&
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data &&
        axiosError.response.data.message
      ) {
        return String(axiosError.response.data.message);
      }
    }
    return String(error);
  }

  /**
   * 处理 API 响应
   * @param response API 响应
   * @param successCallback 成功回调
   * @param errorCallback 错误回调
   * @param defaultErrorMessage 默认错误消息
   */
  static handleApiResponse<T>(
    response: { code?: string; data: T | null; message?: string },
    successCallback: (data: T | null) => void,
    errorCallback: (message: string) => void,
    defaultErrorMessage: string,
  ): void {
    if (response.code === '0') {
      successCallback(response.data);
    } else {
      errorCallback(response.message || defaultErrorMessage);
    }
  }
}

// 兼容性导出
export const isDev = CommonUtils.isDev;
export const isLocal = CommonUtils.isLocal;
export const isLocalDevelopment = CommonUtils.isLocalDevelopment;
export const downloadBlob = CommonUtils.downloadBlob;
export const copyToClipboard = CommonUtils.copyToClipboard;
export const getStaticSrc = CommonUtils.getStaticSrc;
export const find = CommonUtils.find;
export const filterNullField = CommonUtils.filterNullField;
export const trimField = CommonUtils.trimField;
export const filterOption = CommonUtils.filterOption;
export const filterTreeNode = CommonUtils.filterTreeNode;
export const adaptorDictionaryToEnum = CommonUtils.adaptorDictionaryToEnum;
export const adaptorDictionaryToSelect = CommonUtils.adaptorDictionaryToSelect;
export const adaptorListToOptions = CommonUtils.adaptorListToOptions;
export const adaptorListToEnums = CommonUtils.adaptorListToEnums;
export const adaptorListToMapEnums = CommonUtils.adaptorListToMapEnums;
export const convertBoolStr = CommonUtils.convertBoolStr;
export const convertBoolToStr = CommonUtils.convertBoolToStr;
export const addNumbers = CommonUtils.addNumbers;
export const updateFields = CommonUtils.updateFields;
export const resetModelState = CommonUtils.resetModelState;
export const checkVersion = CommonUtils.checkVersion;
export const getErrorMessage = CommonUtils.getErrorMessage;
export const handleApiResponse = CommonUtils.handleApiResponse;
