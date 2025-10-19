import CryptoJS from 'crypto-js';

/**
 * 加密工具类
 * 提供各种加密和解密功能
 */
export class CryptoUtils {
  /**
   * AES 加密
   * @param value 要加密的字符串
   * @param key 加密密钥，默认为项目默认密钥
   * @returns 加密后的字符串
   */
  static aesEncrypt(value: string, key: string = '_AntiFraud@hncy58_'): string {
    if (!value) return '';

    try {
      const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
      const encrypted = CryptoJS.AES.encrypt(value, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    } catch (error) {
      console.error('AES 加密失败:', error);
      return '';
    }
  }

  /**
   * AES 解密
   * @param encryptedValue 加密的字符串
   * @param key 解密密钥，默认为项目默认密钥
   * @returns 解密后的字符串
   */
  static aesDecrypt(encryptedValue: string, key: string = '_AntiFraud@hncy58_'): string {
    if (!encryptedValue) return '';

    try {
      const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('AES 解密失败:', error);
      return '';
    }
  }

  /**
   * MD5 哈希
   * @param value 要哈希的字符串
   * @returns MD5 哈希值
   */
  static md5(value: string): string {
    if (!value) return '';
    return CryptoJS.MD5(value).toString();
  }

  /**
   * SHA256 哈希
   * @param value 要哈希的字符串
   * @returns SHA256 哈希值
   */
  static sha256(value: string): string {
    if (!value) return '';
    return CryptoJS.SHA256(value).toString();
  }

  /**
   * Base64 编码
   * @param value 要编码的字符串
   * @returns Base64 编码后的字符串
   */
  static base64Encode(value: string): string {
    if (!value) return '';
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
  }

  /**
   * Base64 解码
   * @param encodedValue Base64 编码的字符串
   * @returns 解码后的字符串
   */
  static base64Decode(encodedValue: string): string {
    if (!encodedValue) return '';
    try {
      return CryptoJS.enc.Base64.parse(encodedValue).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Base64 解码失败:', error);
      return '';
    }
  }

  /**
   * 生成随机字符串
   * @param length 字符串长度，默认 16
   * @returns 随机字符串
   */
  static generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成 UUID
   * @returns UUID 字符串
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 生成唯一 ID
   * @returns 唯一 ID 字符串
   */
  static generateUniqueId(): string {
    return BigInt(Math.random().toString().substring(2) + Date.now()).toString(36);
  }
}

// 兼容性导出
export const aesEncryption = CryptoUtils.aesEncrypt;
export const aesDecryption = CryptoUtils.aesDecrypt;
export const md5Hash = CryptoUtils.md5;
export const sha256Hash = CryptoUtils.sha256;
export const base64Encode = CryptoUtils.base64Encode;
export const base64Decode = CryptoUtils.base64Decode;
export const generateRandomString = CryptoUtils.generateRandomString;
export const generateUUID = CryptoUtils.generateUUID;
export const generateUniqueId = CryptoUtils.generateUniqueId;

