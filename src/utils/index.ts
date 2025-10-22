import { ProColumns } from '@ant-design/pro-components';
import CryptoJs from 'crypto-js';
import dayjs from 'dayjs';
import { merge } from 'lodash';
import { add, bignumber } from 'mathjs';
import { NUM_CHINESE_ARR, REG_EXP } from './constants';
import { MessageUtils } from './messageUtils';
export const isDev = process.env.UMI_ENV === 'dev';
export const isLocal = process.env.UMI_ENV === 'local';

// 流下载
export const downloadBlob = (blob: Blob | MediaSource, name: string) => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name || `${Math.random() * 10000}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 是否是JSON
export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
// 是否是空
export const isEmpty = (data: any) => {
  return data === '' || data === null || data === undefined || data === 'null';
};

// 适配下拉框搜索
export const filterOption = (input: any, option: any) => {
  return (
    option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};
// 适配树形搜索框
export const filterTreeNode = (inputValue: string, treeNode: any) => {
  return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
};

// 清除搜索栏，空字符串
export const filterNullField = (params: Record<string, any>) => {
  const values: Record<string, any> = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== '') {
      values[key] = params[key];
    }
  });
  return values;
};

// 表单参数去前后空格
export const trimField = (params: Record<string, any>) => {
  const processedParams = Object.keys(params).reduce((acc: Record<string, any>, key) => {
    const value = params[key];
    acc[key] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
  return processedParams;
};

/**
 * Object格式转【查询条件】下拉框options
 * @param {Object} data 待处理的数据，格式为{name:'长沙',name2:'五八'}
 * @return {Object} 返回options数组，格式为
 * {
 *  name: {text: '长沙', status: 'Default'},
 *  name2: {text: '五八', status: 'Default'}
 * }
 */
export const adptorDictinaryToEnum = (data: Record<string, string>) => {
  const res: Record<string, any> = {};
  for (let item in data) {
    if (data.hasOwnProperty(item)) {
      res[item] = { text: data[item], status: '' };
    }
  }
  return res;
};

/**
 * Object格式转【弹窗】下拉框options
 * @param {Object} data 待处理的数据，格式为 {name:'长沙',name2:'五八'}
 * @return {Object} 返回options数组，格式为
 * [
 *  {label: '长沙', value: 'name'},
 *  {label: '五八', value: 'name2'}
 * ]
 */
export const adptorDictinaryToSelect = (data: Record<string, string>) => {
  const res = [];
  for (let item in data) {
    if (data.hasOwnProperty(item)) {
      res.push({
        label: data[item],
        value: item,
      });
    }
  }
  return res;
};

/**
 * 将请求的平台上配置的枚举值转换成下拉框options
 * @param data
 * @returns
 */
export const convertDictDataToArray = (
  data: Record<
    string,
    {
      text: string;
      status: string;
    }
  >,
) => {
  if (!data) {
    return [];
  }

  return Object.entries(data).map(([key, value]) => ({
    label: value.text,
    value: key,
  }));
};

/**
 * List格式转【弹窗】下拉框options
 * @param {Object} data 待处理的数据，格式为[{bankOrgName: '法人1', bankOrgNbr: '101'},{bankOrgName: '法人2', bankOrgNbr: '102'}]
 * @param {string} valueField 指定key，此处为bankOrgNbr
 * @param {string} labelField 指定value，此处为bankOrgName
 * @return {Object} 返回options数组，格式为
 * {
 *  {label: '法人1', value: '101'},
 *  {label: '法人2', value: '102'}
 * }
 */
export const adptorListToOptions = (
  data: any,
  valueField: string = 'value',
  labelField: string = 'label',
) => {
  const res: any = [];
  data.forEach((item: any) => {
    res.push({
      label: item[labelField],
      value: item[valueField],
    });
  });
  return res;
};

/**
 * List格式转【查询条件】下拉框options
 * @param {Object} data 待处理的数据，格式为[{bankOrgName: '法人1', bankOrgNbr: '101'},{bankOrgName: '法人2', bankOrgNbr: '102'}]
 * @param {string} valueField 指定key，此处为bankOrgNbr
 * @param {string} labelField 指定value，此处为bankOrgName
 * @return {Object} 返回options数组，格式为
 * {
 *  101: {text: '法人1', status: 'Default'},
 *  102: {text: '法人2', status: 'Default'}
 * }
 */
export const adptorListToEnums = (
  data: any,
  valueField: string = 'value',
  labelField: string = 'label',
) => {
  const Enum: any = {};
  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      Enum[item[valueField]] = {
        text: item[labelField] || '-',
        status: '',
      };
    });
  }

  return Enum;
};

export const adptorListToMapEnums = <T extends Record<string, any>>(
  data: T[],
  valueField: keyof T = 'value',
  labelField: keyof T = 'label',
) => {
  const Enum: Map<string, any> = new Map();
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
    console.error(`调用 adptorListToMapEnums 方法失败，${data} 不是数组`);
  }
  return Enum;
};

// 登出时，或者登录过期时，清空models里state数据
export const resetModelState = () => {
  localStorage.removeItem('Phoenix:token');
};

/**
 * @name 将 bool 类型的字符串转为 bool 值，'true' -> true，'false' -> false
 * @description 场景1：第一个参数传入 object 类型数据，则会自动检测第一层值为 bool 类型的字符串进行转换，如果传入第二个可选参数，则会排除数组中的字段名不进行转换处理
 * @description 场景2：直接传入 bool 类型的字符串进行转换
 */
export const convertBoolStr = <T extends Record<string, any> | string, K extends keyof T>(
  data: T,
  excludes: K[] = [],
): T => {
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
          (result as Record<string, any>)[key] = value.map((item: any) => convertBoolStr(item));
        }
        if (Object.prototype.toString.call(value) === '[object Object]') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            (value as Record<string, any>)[subKey] = convertBoolStr(subValue as any);
          });
        }
      });
    }
  } catch (error) {
    console.error('convertBoolStr error: ', error);
  }

  return result;
};

/**
 * 将 bool 值转为 bool 类型字符串，true -> 'true'，false -> 'false'
 * @param data
 * @param excludes
 * @returns
 */
export const convertBoolToStr = <T extends Record<string, any> | boolean, K extends keyof T>(
  data: T,
  excludes: K[] = [],
): T => {
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
          (result as Record<string, any>)[key] = value.map((item: any) => convertBoolToStr(item));
        }
        if (Object.prototype.toString.call(value) === '[object Object]') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            (value as Record<string, any>)[subKey] = convertBoolToStr(subValue as any);
          });
        }
      });
    }
  } catch (error) {
    console.error('convertBoolToStr error: ', error);
  }

  return result;
};
/** 校验当前表格数据是否符合要求 */
export const listValidator = (list = [], requiredFields: string[]) => {
  let isValid = true;

  list.forEach((item) => {
    requiredFields.forEach((key) => {
      if (item[key] === undefined || item[key] === null) {
        isValid = false;
      }
    });
  });

  return isValid;
};

/**
 * 金额格式转换
 * @param {Object} data 待处理的数据，格式为1234567.89
 * @return {Object} 返回字符串，格式为 1,234,567.89
 */
export const formatCurrency = (
  amount: string | number,
  currencySymbol = '',
  decimalPlaces = 2,
  thousandSeparator = ',',
  decimalSeparator = '.',
) => {
  if (amount === 0) {
    return '0';
  }
  if (!amount) {
    return '-';
  }
  // 将数字转换为字符串并保留指定的小数位数
  let amountStr = Number(amount).toFixed(decimalPlaces);

  // 分离整数部分和小数部分
  let [integerPart, decimalPart] = amountStr.split('.');

  // 添加千位分隔符
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // 合并整数部分和小数部分
  if (decimalPart === '00') {
    return `￥${currencySymbol}${integerPart}`;
  }
  return `￥${currencySymbol}${integerPart}${decimalSeparator}${decimalPart}`;
};

/**
 * 比例格式转换
 * @param {Object} data 待处理的数据，格式为1
 * @return {Object} 返回字符串，格式为 100%
 */
export const formatRate = (rate: string | number, decimalPlaces = 2, suffix = '%') => {
  if (rate === 0) {
    return '0%';
  }
  if (!rate) {
    return '-';
  }
  // 将数字转换为字符串并保留指定的小数位数
  let rateStr = (Number(rate) * 100).toFixed(decimalPlaces);

  // 分离整数部分和小数部分
  let [integerPart, decimalPart] = rateStr.split('.');

  // 合并整数部分和小数部分
  if (decimalPart === '00') {
    return `${integerPart}${suffix}`;
  }
  return `${integerPart}.${decimalPart}${suffix}`;
};

/** 通用导出方法封装 */
export const executeDownload = async <T>({
  method,
  params,
  name = '文件',
  type = '导出',
  onSuccess,
  extra,
}: {
  /** 导出接口 */
  method: (data: T, options?: any) => Promise<any>;
  /** 导出接口传参 */
  params: T;
  /** 导出文件名 */
  name?: string;
  /** 操作名称，导出/下载 */
  type?: string;
  /** 导出成功回调 */
  onSuccess?: () => void;
  /** 额外传参 */
  extra?: any;
}) => {
  const hide = MessageUtils.loading(`正在${type}${name}...`, 15);
  try {
    const { doubleCheck = false, doubleCheckUsername = '', doubleCheckPassword } = extra || {};
    const file = await method(params, {
      responseType: 'blob',
      headers: {
        'DOUBLE-CHECK-YN': doubleCheck ? 'Y' : 'N',
        doubleCheckUsername,
        doubleCheckPassword: aesEncryption(doubleCheckPassword),
      },
    });
    const text = await file.text();
    if (isJSON(text)) {
      MessageUtils.error(JSON.parse(text).message);
    } else {
      downloadBlob(file, `${name}${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`);
      MessageUtils.success(`${type}成功`);
      onSuccess?.();
    }
  } catch (error) {
    console.error(`${type}${name} error: `, error);
    MessageUtils.error(`${type}失败`);
  } finally {
    hide();
  }
};

/** 时间差格式化展示（入参时间单位：秒），1->1秒，61->1分1秒，3661->1时1分1秒 */
export function formatTimeDiff(diff: number) {
  let duration: number[] = [];
  let remain = diff;
  while (remain) {
    duration.push(remain % 60);
    if (remain >= 60) {
      remain = Math.floor(remain / 60);
    } else {
      break;
    }
  }
  let result = '';
  ['秒', '分', '时'].forEach((unit, idx) => {
    if (duration[idx] !== undefined) {
      result = `${duration[idx]}${unit}${result}`;
    }
  });
  return result;
}

/**
 * 生成唯一UUID
 */
export const generateId = () =>
  BigInt(Math.random().toString().substring(2) + Date.now()).toString(36);

/**
 * 银行卡脱敏
 * @param card 待脱敏的银行卡号
 * @return '1234**********4321'
 */
export const encryptCardFn = (card: string | undefined) => {
  if (!card) {
    return '';
  }
  const prefix = card.slice(0, 4);
  const suffix = card.slice(-4);
  const maskedPart = card.slice(4, -4).replace(/./g, '*');
  return `${prefix}${maskedPart}${suffix}`;
};

/** 用户名脱敏，张三 -> 张* */
export const encryptName = (name: string | undefined) => {
  if (!name) {
    return '';
  }

  return `${name[0]}${'*'.repeat(name.length - 1)}`;
};

/** 获取可唯一区分身份证号的加密身份证子串 */
export const getUniqueSubIdNbrStr = (
  idNbr: string,
  idNbrList: { idNbr: string }[],
  searchVal: string,
) => {
  let partIdNbrLength = REG_EXP.IDNBR.test(searchVal) ? searchVal.length : 6;

  const helper = () => {
    const str = idNbr.slice(0 - partIdNbrLength);
    const target = idNbrList.filter(({ idNbr }) => idNbr.endsWith(str));
    if (target.length > 1 && partIdNbrLength < 18) {
      partIdNbrLength += 1;
      helper();
    }
  };

  helper();
  // 兼容测试环境， 身份证idNbr位数不足18位取0
  const encryptLength = idNbr.length - partIdNbrLength >= 0 ? idNbr.length - partIdNbrLength : 0;
  const reg = new RegExp('^\\d{' + encryptLength + '}');
  return idNbr.replace(reg, '*'.repeat(encryptLength));
};

// aes 加密
/**
 * aes 加密, 给密码加密，返回一串密文
 * @param data
 * @returns
 */
export const aesEncryption = (value: string) => {
  const key = CryptoJs.enc.Utf8.parse('_Phoenix@hncy58_');
  const ciphertext = CryptoJs.AES.encrypt(value, key, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7,
  }).toString();
  return ciphertext;
};

/** 复制到剪切板 **/
export const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      MessageUtils.success('复制成功');
    })
    .catch(() => {
      MessageUtils.error('复制失败');
    });
};

/** proTable columns 数据预处理 */
export const withColumns = (columns: ProColumns[]) => {
  // 不展示金额符号
  const moneySymbolConfig = {
    fieldProps: {
      moneySymbol: false,
    },
  };

  return columns.map((column) => {
    if (column.valueType === 'money') {
      return merge({}, moneySymbolConfig, column);
    }
    return column;
  });
};

type NumberInput = number | number[];
/**
 * 加法求和
 * @param  调用方式addNumbers(1,2,3)或者addNumbers([1,2,3])都可
 * @returns 加法运算结果
 */
export const addNumbers = (...args: NumberInput[]): number => {
  const flattenedArgs = args.flat();
  const res = flattenedArgs.reduce((acc, cur) => {
    return add(bignumber(acc), bignumber(cur));
  }, bignumber(0));
  return Number(res);
};

/**
 * 更新obj中字段为null的值为0
 * @obj  原始obj
 * @fields  Array  值为null的字段
 * @example
 * const obj = [a:null, b:null, c:2]
 * updateFields(obj, ['a','b'])
 * obj = {a: 0, b: 0, c: 2}
 */
export const updateFields = (obj: any, fields: any) => {
  fields.forEach((field: string) => {
    if (obj[field] === null || obj[field] === undefined || obj[field] === '') {
      obj[field] = 0;
    }
  });
};

export async function checkVersion(setShowUpdateNotice: any, setCount: any) {
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
 * 将 两位数 数字转换成中文
 * @param num 传入数字
 * @returns 返回中文数字
 * @example 99 => 九十九
 */
export const num2Chinese = (num: number): string => {
  if (typeof num !== 'number') {
    return '请传入数字类型';
  }
  if (!Number.isInteger(num) || num < 0 || num >= 100) {
    return '数字不是整数 或 超出最大范围（99）';
  }
  if (num < 10) {
    return NUM_CHINESE_ARR[num];
  } else {
    const tens = num / 10;
    const ones = num % 10;
    const finalOnes = ones === 0 ? '' : NUM_CHINESE_ARR[ones];
    return tens === 1 ? '十' : `${NUM_CHINESE_ARR[tens]}十${finalOnes}`;
  }
};

/** 获取静态资源路径，如果作为子应用访问，请求绝对路径 */
export const getStaticSrc = (src: string) => {
  if ((window as any).__POWERED_BY_QIANKUN__) {
    return (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + src.replace(/^\//, '');
  }
  return src;
};

/**
 * 检测是否为本地开发环境
 */
export const isLocalDevelopment = () => {
  // 主要检测：环境变量
  const envCheck = process.env.UMI_ENV === 'local' || process.env.UMI_ENV === 'dev';

  // 辅助检测：统一门户（不在统一门户中）
  const portalCheck = !(window.top && window.top !== window);

  // 辅助检测：开发模式
  const devModeCheck = process.env.NODE_ENV === 'development';

  return envCheck || (portalCheck && devModeCheck);
};
