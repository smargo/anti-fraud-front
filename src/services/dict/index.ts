import { request } from '@umijs/max';

// 字典相关类型定义
export interface DictItem {
  value: string | number;
  label: string;
  status?: string;
  [key: string]: any;
}

export interface DictData {
  [key: string]: DictItem;
}

export interface DictResponse {
  code: string;
  name: string;
  items: DictItem[];
}

/**
 * 字典服务
 */
export class DictService {
  // 获取字典数据
  static async getDictData(code: string): Promise<DictData> {
    try {
      const response = await request(`/api/dict/${code}`, {
        method: 'GET',
      });

      if (response && response.items) {
        const dictData: DictData = {};
        response.items.forEach((item: DictItem) => {
          dictData[String(item.value)] = {
            text: item.label,
            status: item.status,
            ...item,
          };
        });
        return dictData;
      }

      return {};
    } catch (error) {
      console.error(`获取字典数据失败: ${code}`, error);
      return {};
    }
  }

  // 获取字典选项（用于下拉框）
  static async getDictOptions(
    code: string,
  ): Promise<Array<{ label: string; value: string | number }>> {
    try {
      const dictData = await this.getDictData(code);
      return Object.entries(dictData).map(([value, item]) => ({
        label: item.text,
        value: value,
      }));
    } catch (error) {
      console.error(`获取字典选项失败: ${code}`, error);
      return [];
    }
  }

  // 获取字典文本
  static async getDictText(
    code: string,
    value: string | number,
    defaultValue: string = '-',
  ): Promise<string> {
    try {
      const dictData = await this.getDictData(code);
      const item = dictData[String(value)];
      return item ? item.text : defaultValue;
    } catch (error) {
      console.error(`获取字典文本失败: ${code}, ${value}`, error);
      return defaultValue;
    }
  }

  // 获取字典状态
  static async getDictStatus(code: string, value: string | number): Promise<string | undefined> {
    try {
      const dictData = await this.getDictData(code);
      const item = dictData[String(value)];
      return item ? item.status : undefined;
    } catch (error) {
      console.error(`获取字典状态失败: ${code}, ${value}`, error);
      return undefined;
    }
  }

  // 检查字典值是否存在
  static async hasDictValue(code: string, value: string | number): Promise<boolean> {
    try {
      const dictData = await this.getDictData(code);
      return String(value) in dictData;
    } catch (error) {
      console.error(`检查字典值失败: ${code}, ${value}`, error);
      return false;
    }
  }

  // 获取字典的所有值
  static async getDictValues(code: string): Promise<string[]> {
    try {
      const dictData = await this.getDictData(code);
      return Object.keys(dictData);
    } catch (error) {
      console.error(`获取字典值列表失败: ${code}`, error);
      return [];
    }
  }

  // 获取字典的所有标签
  static async getDictLabels(code: string): Promise<string[]> {
    try {
      const dictData = await this.getDictData(code);
      return Object.values(dictData).map((item) => item.text);
    } catch (error) {
      console.error(`获取字典标签列表失败: ${code}`, error);
      return [];
    }
  }

  // 根据标签获取值
  static async getDictValueByLabel(
    code: string,
    label: string,
  ): Promise<string | number | undefined> {
    try {
      const dictData = await this.getDictData(code);
      const entry = Object.entries(dictData).find(([, item]) => item.text === label);
      return entry ? entry[0] : undefined;
    } catch (error) {
      console.error(`根据标签获取字典值失败: ${code}, ${label}`, error);
      return undefined;
    }
  }

  // 刷新字典缓存
  static async refreshDictCache(code?: string): Promise<void> {
    try {
      if (code) {
        await request(`/api/dict/${code}/refresh`, {
          method: 'POST',
        });
      } else {
        await request('/api/dict/refresh-all', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('刷新字典缓存失败', error);
    }
  }

  // 创建字典
  static async createDict(data: {
    code: string;
    name: string;
    description?: string;
    items: DictItem[];
  }): Promise<void> {
    try {
      await request('/api/dict', {
        method: 'POST',
        data,
      });
    } catch (error) {
      console.error('创建字典失败', error);
      throw error;
    }
  }

  // 更新字典
  static async updateDict(
    code: string,
    data: {
      name?: string;
      description?: string;
      items?: DictItem[];
    },
  ): Promise<void> {
    try {
      await request(`/api/dict/${code}`, {
        method: 'PUT',
        data,
      });
    } catch (error) {
      console.error('更新字典失败', error);
      throw error;
    }
  }

  // 删除字典
  static async deleteDict(code: string): Promise<void> {
    try {
      await request(`/api/dict/${code}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('删除字典失败', error);
      throw error;
    }
  }

  // 获取字典列表
  static async getDictList(params?: any): Promise<DictResponse[]> {
    try {
      const response = await request('/api/dict/list', {
        method: 'GET',
        params,
      });
      return response || [];
    } catch (error) {
      console.error('获取字典列表失败', error);
      return [];
    }
  }
}

// 兼容性导出
export const getDictData = DictService.getDictData;
export const getDictOptions = DictService.getDictOptions;
export const getDictText = DictService.getDictText;
export const getDictStatus = DictService.getDictStatus;
export const hasDictValue = DictService.hasDictValue;
export const getDictValues = DictService.getDictValues;
export const getDictLabels = DictService.getDictLabels;
export const getDictValueByLabel = DictService.getDictValueByLabel;
export const refreshDictCache = DictService.refreshDictCache;
export const createDict = DictService.createDict;
export const updateDict = DictService.updateDict;
export const deleteDict = DictService.deleteDict;
export const getDictList = DictService.getDictList;
