/**
 * 验证工具类
 * 提供各种数据验证功能
 */
export class ValidateUtils {
  /**
   * 验证是否为空
   * @param value 要验证的值
   * @returns 是否为空
   */
  static isEmpty(value: any): boolean {
    return value === '' || value === null || value === undefined || value === 'null';
  }

  /**
   * 验证是否为有效值（非空）
   * @param value 要验证的值
   * @returns 是否为有效值
   */
  static isNotEmpty(value: any): boolean {
    return !this.isEmpty(value);
  }

  /**
   * 验证是否为数字
   * @param value 要验证的值
   * @returns 是否为数字
   */
  static isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * 验证是否为整数
   * @param value 要验证的值
   * @returns 是否为整数
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  /**
   * 验证是否为浮点数
   * @param value 要验证的值
   * @returns 是否为浮点数
   */
  static isFloat(value: any): boolean {
    return this.isNumber(value) && !this.isInteger(value);
  }

  /**
   * 验证是否为字符串
   * @param value 要验证的值
   * @returns 是否为字符串
   */
  static isString(value: any): boolean {
    return typeof value === 'string';
  }

  /**
   * 验证是否为布尔值
   * @param value 要验证的值
   * @returns 是否为布尔值
   */
  static isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  /**
   * 验证是否为数组
   * @param value 要验证的值
   * @returns 是否为数组
   */
  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * 验证是否为对象
   * @param value 要验证的值
   * @returns 是否为对象
   */
  static isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * 验证是否为函数
   * @param value 要验证的值
   * @returns 是否为函数
   */
  static isFunction(value: any): boolean {
    return typeof value === 'function';
  }

  /**
   * 验证是否为日期
   * @param value 要验证的值
   * @returns 是否为日期
   */
  static isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }

  /**
   * 验证是否为有效的 JSON 字符串
   * @param str 要验证的字符串
   * @returns 是否为有效的 JSON 字符串
   */
  static isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证邮箱格式
   * @param email 邮箱地址
   * @returns 是否为有效的邮箱格式
   */
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证手机号格式
   * @param phone 手机号
   * @returns 是否为有效的手机号格式
   */
  static isPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 验证身份证号格式
   * @param idCard 身份证号
   * @returns 是否为有效的身份证号格式
   */
  static isIdCard(idCard: string): boolean {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return idCardRegex.test(idCard);
  }

  /**
   * 验证银行卡号格式
   * @param cardNumber 银行卡号
   * @returns 是否为有效的银行卡号格式
   */
  static isBankCard(cardNumber: string): boolean {
    const cardRegex = /^\d{16,19}$/;
    return cardRegex.test(cardNumber);
  }

  /**
   * 验证 URL 格式
   * @param url URL 地址
   * @returns 是否为有效的 URL 格式
   */
  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证 IP 地址格式
   * @param ip IP 地址
   * @returns 是否为有效的 IP 地址格式
   */
  static isIP(ip: string): boolean {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  }

  /**
   * 验证密码强度
   * @param password 密码
   * @param minLength 最小长度，默认为 8
   * @returns 密码强度等级 (weak, medium, strong)
   */
  static validatePasswordStrength(
    password: string,
    minLength: number = 8,
  ): 'weak' | 'medium' | 'strong' {
    if (password.length < minLength) {
      return 'weak';
    }

    let score = 0;

    // 包含小写字母
    if (/[a-z]/.test(password)) score++;

    // 包含大写字母
    if (/[A-Z]/.test(password)) score++;

    // 包含数字
    if (/\d/.test(password)) score++;

    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  }

  /**
   * 验证字符串长度
   * @param str 字符串
   * @param min 最小长度
   * @param max 最大长度
   * @returns 是否符合长度要求
   */
  static validateLength(str: string, min: number, max: number): boolean {
    const length = str.length;
    return length >= min && length <= max;
  }

  /**
   * 验证数字范围
   * @param num 数字
   * @param min 最小值
   * @param max 最大值
   * @returns 是否在范围内
   */
  static validateRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }

  /**
   * 验证是否包含中文字符
   * @param str 字符串
   * @returns 是否包含中文字符
   */
  static containsChinese(str: string): boolean {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return chineseRegex.test(str);
  }

  /**
   * 验证是否只包含中文字符
   * @param str 字符串
   * @returns 是否只包含中文字符
   */
  static isChineseOnly(str: string): boolean {
    const chineseRegex = /^[\u4e00-\u9fa5]+$/;
    return chineseRegex.test(str);
  }

  /**
   * 验证是否只包含英文字符
   * @param str 字符串
   * @returns 是否只包含英文字符
   */
  static isEnglishOnly(str: string): boolean {
    const englishRegex = /^[a-zA-Z]+$/;
    return englishRegex.test(str);
  }

  /**
   * 验证是否只包含数字
   * @param str 字符串
   * @returns 是否只包含数字
   */
  static isNumericOnly(str: string): boolean {
    const numericRegex = /^\d+$/;
    return numericRegex.test(str);
  }

  /**
   * 验证是否只包含字母和数字
   * @param str 字符串
   * @returns 是否只包含字母和数字
   */
  static isAlphanumericOnly(str: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
  }

  /**
   * 验证前后不能有空格
   * @param str 字符串
   * @returns 验证结果对象
   */
  static validateNoSpace(str: string): { isValid: boolean; message?: string } {
    const spaceRegex = /^\s+|\s+$/;
    if (spaceRegex.test(str)) {
      return {
        isValid: false,
        message: '输入内容前后不允许有空格',
      };
    }
    return { isValid: true };
  }

  /**
   * 验证文件类型
   * @param fileName 文件名
   * @param allowedTypes 允许的文件类型数组
   * @returns 是否为允许的文件类型
   */
  static validateFileType(fileName: string, allowedTypes: string[]): boolean {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return fileExtension ? allowedTypes.includes(fileExtension) : false;
  }

  /**
   * 验证文件大小
   * @param fileSize 文件大小（字节）
   * @param maxSize 最大文件大小（字节）
   * @returns 是否符合大小要求
   */
  static validateFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize;
  }

  /**
   * 验证数组长度
   * @param arr 数组
   * @param min 最小长度
   * @param max 最大长度
   * @returns 是否符合长度要求
   */
  static validateArrayLength(arr: any[], min: number, max: number): boolean {
    const length = arr.length;
    return length >= min && length <= max;
  }

  /**
   * 验证对象是否包含必需字段
   * @param obj 对象
   * @param requiredFields 必需字段数组
   * @returns 是否包含所有必需字段
   */
  static validateRequiredFields(obj: any, requiredFields: string[]): boolean {
    return requiredFields.every(
      (field) => obj.hasOwnProperty(field) && this.isNotEmpty(obj[field]),
    );
  }

  /**
   * 验证数组中的对象是否符合要求
   * @param list 对象数组
   * @param requiredFields 必需字段数组
   * @returns 是否所有对象都符合要求
   */
  static validateListFields(list: any[], requiredFields: string[]): boolean {
    return list.every((item) => this.validateRequiredFields(item, requiredFields));
  }
}

// 兼容性导出
export const isEmpty = ValidateUtils.isEmpty;
export const isNotEmpty = ValidateUtils.isNotEmpty;
export const isNumber = ValidateUtils.isNumber;
export const isInteger = ValidateUtils.isInteger;
export const isFloat = ValidateUtils.isFloat;
export const isString = ValidateUtils.isString;
export const isBoolean = ValidateUtils.isBoolean;
export const isArray = ValidateUtils.isArray;
export const isObject = ValidateUtils.isObject;
export const isFunction = ValidateUtils.isFunction;
export const isDate = ValidateUtils.isDate;
export const isJSON = ValidateUtils.isJSON;
export const isEmail = ValidateUtils.isEmail;
export const isPhone = ValidateUtils.isPhone;
export const isIdCard = ValidateUtils.isIdCard;
export const isBankCard = ValidateUtils.isBankCard;
export const isURL = ValidateUtils.isURL;
export const isIP = ValidateUtils.isIP;
export const validatePasswordStrength = ValidateUtils.validatePasswordStrength;
export const validateLength = ValidateUtils.validateLength;
export const validateRange = ValidateUtils.validateRange;
export const containsChinese = ValidateUtils.containsChinese;
export const isChineseOnly = ValidateUtils.isChineseOnly;
export const isEnglishOnly = ValidateUtils.isEnglishOnly;
export const isNumericOnly = ValidateUtils.isNumericOnly;
export const isAlphanumericOnly = ValidateUtils.isAlphanumericOnly;
export const validateNoSpace = ValidateUtils.validateNoSpace;
export const validateFileType = ValidateUtils.validateFileType;
export const validateFileSize = ValidateUtils.validateFileSize;
export const validateArrayLength = ValidateUtils.validateArrayLength;
export const validateRequiredFields = ValidateUtils.validateRequiredFields;
export const validateListFields = ValidateUtils.validateListFields;

