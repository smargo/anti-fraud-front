import dayjs from 'dayjs';
import { NUM_CHINESE_ARR } from './constants';

/**
 * 格式化工具类
 * 提供各种数据格式化功能
 */
export class FormatUtils {
  /**
   * 格式化日期时间
   * @param dateTime 日期时间值
   * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
   * @param defaultText 默认显示文本，当日期无效时返回
   * @returns 格式化后的日期时间字符串
   */
  static formatDateTime(
    dateTime: any,
    format: string = 'YYYY-MM-DD HH:mm:ss',
    defaultText: string = '-',
  ): string {
    if (!dateTime) return defaultText;

    try {
      const dateObj = dayjs.isDayjs(dateTime) ? dateTime : dayjs(dateTime);
      return dateObj.isValid() ? dateObj.format(format) : defaultText;
    } catch (error) {
      console.warn('格式化日期时间失败:', error, '原始值:', dateTime);
      return defaultText;
    }
  }

  /**
   * 格式化日期
   * @param date 日期
   * @param format 日期格式，默认为 'YYYY-MM-DD'
   * @param defaultValue 默认显示值，当日期为空时显示
   * @returns 格式化后的日期字符串
   */
  static formatDate(
    date: string | Date | dayjs.Dayjs | null | undefined,
    format: string = 'YYYY-MM-DD',
    defaultValue: string = '-',
  ): string {
    if (!date) return defaultValue;

    try {
      return dayjs(date).format(format);
    } catch {
      return defaultValue;
    }
  }

  /**
   * 格式化时间
   * @param time 时间
   * @param format 时间格式，默认为 'HH:mm:ss'
   * @param defaultValue 默认显示值
   * @returns 格式化后的时间字符串
   */
  static formatTime(
    time: string | Date | dayjs.Dayjs | null | undefined,
    format: string = 'HH:mm:ss',
    defaultValue: string = '-',
  ): string {
    if (!time) return defaultValue;

    try {
      return dayjs(time).format(format);
    } catch {
      return defaultValue;
    }
  }

  /**
   * 格式化金额
   * @param amount 金额字符串或数字
   * @param currencySymbol 货币符号，默认为 '￥'
   * @param decimalPlaces 小数位数，默认为 2
   * @param thousandSeparator 千位分隔符，默认为 ','
   * @param decimalSeparator 小数分隔符，默认为 '.'
   * @param defaultValue 默认显示值，当金额为空或0时显示
   * @returns 格式化后的金额字符串
   */
  static formatCurrency(
    amount: string | number | null | undefined,
    currencySymbol: string = '￥',
    decimalPlaces: number = 2,
    thousandSeparator: string = ',',
    decimalSeparator: string = '.',
    defaultValue: string = '-',
  ): string {
    if (amount === 0) return `${currencySymbol}0`;
    if (!amount) return defaultValue;

    try {
      // 将数字转换为字符串并保留指定的小数位数
      let amountStr = Number(amount).toFixed(decimalPlaces);

      // 分离整数部分和小数部分
      let [integerPart, decimalPart] = amountStr.split('.');

      // 添加千位分隔符
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

      // 合并整数部分和小数部分
      if (decimalPart === '00') {
        return `${currencySymbol}${integerPart}`;
      }
      return `${currencySymbol}${integerPart}${decimalSeparator}${decimalPart}`;
    } catch (error) {
      console.warn('格式化金额失败:', error);
      return defaultValue;
    }
  }

  /**
   * 格式化比例
   * @param rate 比例值
   * @param decimalPlaces 小数位数，默认为 2
   * @param suffix 后缀，默认为 '%'
   * @param defaultValue 默认显示值
   * @returns 格式化后的比例字符串
   */
  static formatRate(
    rate: string | number | null | undefined,
    decimalPlaces: number = 2,
    suffix: string = '%',
    defaultValue: string = '-',
  ): string {
    if (rate === 0) return `0${suffix}`;
    if (!rate) return defaultValue;

    try {
      // 将数字转换为字符串并保留指定的小数位数
      let rateStr = (Number(rate) * 100).toFixed(decimalPlaces);

      // 分离整数部分和小数部分
      let [integerPart, decimalPart] = rateStr.split('.');

      // 合并整数部分和小数部分
      if (decimalPart === '00') {
        return `${integerPart}${suffix}`;
      }
      return `${integerPart}.${decimalPart}${suffix}`;
    } catch (error) {
      console.warn('格式化比例失败:', error);
      return defaultValue;
    }
  }

  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @param decimals 小数位数，默认为 2
   * @returns 格式化后的文件大小字符串
   */
  static formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * 格式化数字
   * @param num 数字
   * @param decimals 小数位数，默认为 2
   * @param thousandSeparator 千位分隔符，默认为 ','
   * @param defaultValue 默认显示值
   * @returns 格式化后的数字字符串
   */
  static formatNumber(
    num: number | string | null | undefined,
    decimals: number = 2,
    thousandSeparator: string = ',',
    defaultValue: string = '-',
  ): string {
    if (num === 0) return '0';
    if (!num) return defaultValue;

    try {
      const number = Number(num);
      if (isNaN(number)) return defaultValue;

      let formatted = number.toFixed(decimals);

      // 添加千位分隔符
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

      return parts.join('.');
    } catch (error) {
      console.warn('格式化数字失败:', error);
      return defaultValue;
    }
  }

  /**
   * 格式化手机号
   * @param phone 手机号
   * @returns 格式化后的手机号字符串 (如: 138****8888)
   */
  static formatPhone(phone: string | null | undefined): string {
    if (!phone) return '-';

    if (phone.length === 11) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }

    return phone;
  }

  /**
   * 格式化身份证号
   * @param idCard 身份证号
   * @returns 格式化后的身份证号字符串 (如: 123456********1234)
   */
  static formatIdCard(idCard: string | null | undefined): string {
    if (!idCard) return '-';

    if (idCard.length === 18) {
      return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
    }

    return idCard;
  }

  /**
   * 格式化银行卡号
   * @param cardNumber 银行卡号
   * @returns 格式化后的银行卡号字符串 (如: 1234**********4321)
   */
  static formatBankCard(cardNumber: string | null | undefined): string {
    if (!cardNumber) return '-';

    const prefix = cardNumber.slice(0, 4);
    const suffix = cardNumber.slice(-4);
    const maskedPart = cardNumber.slice(4, -4).replace(/./g, '*');

    return `${prefix}${maskedPart}${suffix}`;
  }

  /**
   * 格式化姓名
   * @param name 姓名
   * @returns 格式化后的姓名字符串 (如: 张*)
   */
  static formatName(name: string | null | undefined): string {
    if (!name) return '-';

    if (name.length === 1) return name;

    return `${name[0]}${'*'.repeat(name.length - 1)}`;
  }

  /**
   * 时间差格式化展示
   * @param diff 时间差（秒）
   * @returns 格式化后的时间差字符串 (如: 1时1分1秒)
   */
  static formatTimeDiff(diff: number): string {
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
   * 将数字转换为中文
   * @param num 数字（0-99）
   * @returns 中文数字字符串
   */
  static numberToChinese(num: number): string {
    if (typeof num !== 'number') {
      return '请传入数字类型';
    }

    if (!Number.isInteger(num) || num < 0 || num >= 100) {
      return '数字不是整数 或 超出最大范围（99）';
    }

    if (num < 10) {
      return NUM_CHINESE_ARR[num];
    } else {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      const finalOnes = ones === 0 ? '' : NUM_CHINESE_ARR[ones];
      return tens === 1 ? `十${finalOnes}` : `${NUM_CHINESE_ARR[tens]}十${finalOnes}`;
    }
  }

  /**
   * 格式化相对时间
   * @param dateTime 日期时间
   * @returns 相对时间字符串 (如: 2小时前)
   */
  static formatRelativeTime(dateTime: any): string {
    if (!dateTime) return '-';

    try {
      const now = dayjs();
      const target = dayjs(dateTime);

      if (!target.isValid()) return '-';

      const diffInSeconds = now.diff(target, 'second');

      if (diffInSeconds < 60) {
        return '刚刚';
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}分钟前`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}小时前`;
      } else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)}天前`;
      } else if (diffInSeconds < 31536000) {
        return `${Math.floor(diffInSeconds / 2592000)}个月前`;
      } else {
        return `${Math.floor(diffInSeconds / 31536000)}年前`;
      }
    } catch (error) {
      console.warn('格式化相对时间失败:', error);
      return '-';
    }
  }
}

// 兼容性导出
export const formatDateTime = FormatUtils.formatDateTime;
export const formatDate = FormatUtils.formatDate;
export const formatTime = FormatUtils.formatTime;
export const formatCurrency = FormatUtils.formatCurrency;
export const formatRate = FormatUtils.formatRate;
export const formatFileSize = FormatUtils.formatFileSize;
export const formatNumber = FormatUtils.formatNumber;
export const formatPhone = FormatUtils.formatPhone;
export const formatIdCard = FormatUtils.formatIdCard;
export const formatBankCard = FormatUtils.formatBankCard;
export const formatName = FormatUtils.formatName;
export const formatTimeDiff = FormatUtils.formatTimeDiff;
export const numberToChinese = FormatUtils.numberToChinese;
export const formatRelativeTime = FormatUtils.formatRelativeTime;

