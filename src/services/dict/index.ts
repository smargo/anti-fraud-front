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
}

// 兼容性导出
export const getDictData = DictService.getDictData;
export const getDictOptions = DictService.getDictOptions;
export const getDictText = DictService.getDictText;
export const getDictValues = DictService.getDictValues;
export const createDict = DictService.createDict;
export const updateDict = DictService.updateDict;
export const deleteDict = DictService.deleteDict;
