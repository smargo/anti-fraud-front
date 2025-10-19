import { request } from '@umijs/max';

// Phoenix 系统相关类型定义
export interface User {
  id?: string;
  username: string;
  email?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles?: string[];
  createTime?: string;
  updateTime?: string;
}

export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createTime?: string;
}

export interface Permission {
  id?: string;
  name: string;
  code: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Menu {
  id?: string;
  name: string;
  path: string;
  icon?: string;
  parentId?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
  children?: Menu[];
}

export interface Dictionary {
  id?: string;
  code: string;
  name: string;
  description?: string;
  items: DictionaryItem[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DictionaryItem {
  id?: string;
  value: string;
  label: string;
  description?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginLog {
  id?: string;
  userId: string;
  username: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface OperationLog {
  id?: string;
  userId: string;
  username: string;
  operation: string;
  resource: string;
  operationTime: string;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILED';
  message?: string;
}

/**
 * Phoenix 系统服务
 */
export class PhoenixService {
  // 用户管理
  static async getUsers(params?: any) {
    return request('/api/phoenix/users', {
      method: 'GET',
      params,
    });
  }

  static async getUser(id: string) {
    return request(`/api/phoenix/users/${id}`, {
      method: 'GET',
    });
  }

  static async createUser(data: User) {
    return request('/api/phoenix/users', {
      method: 'POST',
      data,
    });
  }

  static async updateUser(id: string, data: User) {
    return request(`/api/phoenix/users/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteUser(id: string) {
    return request(`/api/phoenix/users/${id}`, {
      method: 'DELETE',
    });
  }

  static async resetPassword(id: string, newPassword: string) {
    return request(`/api/phoenix/users/${id}/reset-password`, {
      method: 'POST',
      data: { password: newPassword },
    });
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    return request('/api/phoenix/users/change-password', {
      method: 'POST',
      data: { oldPassword, newPassword },
    });
  }

  // 角色管理
  static async getRoles(params?: any) {
    return request('/api/phoenix/roles', {
      method: 'GET',
      params,
    });
  }

  static async getRole(id: string) {
    return request(`/api/phoenix/roles/${id}`, {
      method: 'GET',
    });
  }

  static async createRole(data: Role) {
    return request('/api/phoenix/roles', {
      method: 'POST',
      data,
    });
  }

  static async updateRole(id: string, data: Role) {
    return request(`/api/phoenix/roles/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteRole(id: string) {
    return request(`/api/phoenix/roles/${id}`, {
      method: 'DELETE',
    });
  }

  static async assignPermissions(roleId: string, permissionIds: string[]) {
    return request(`/api/phoenix/roles/${roleId}/permissions`, {
      method: 'POST',
      data: { permissionIds },
    });
  }

  // 权限管理
  static async getPermissions(params?: any) {
    return request('/api/phoenix/permissions', {
      method: 'GET',
      params,
    });
  }

  static async getPermission(id: string) {
    return request(`/api/phoenix/permissions/${id}`, {
      method: 'GET',
    });
  }

  static async createPermission(data: Permission) {
    return request('/api/phoenix/permissions', {
      method: 'POST',
      data,
    });
  }

  static async updatePermission(id: string, data: Permission) {
    return request(`/api/phoenix/permissions/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deletePermission(id: string) {
    return request(`/api/phoenix/permissions/${id}`, {
      method: 'DELETE',
    });
  }

  // 菜单管理
  static async getMenus(params?: any) {
    return request('/api/phoenix/menus', {
      method: 'GET',
      params,
    });
  }

  static async getMenuTree() {
    return request('/api/phoenix/menus/tree', {
      method: 'GET',
    });
  }

  static async getMenu(id: string) {
    return request(`/api/phoenix/menus/${id}`, {
      method: 'GET',
    });
  }

  static async createMenu(data: Menu) {
    return request('/api/phoenix/menus', {
      method: 'POST',
      data,
    });
  }

  static async updateMenu(id: string, data: Menu) {
    return request(`/api/phoenix/menus/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteMenu(id: string) {
    return request(`/api/phoenix/menus/${id}`, {
      method: 'DELETE',
    });
  }

  // 字典管理
  static async getDictionaries(params?: any) {
    return request('/api/phoenix/dictionaries', {
      method: 'GET',
      params,
    });
  }

  static async getDictionary(id: string) {
    return request(`/api/phoenix/dictionaries/${id}`, {
      method: 'GET',
    });
  }

  static async getDictionaryByCode(code: string) {
    return request(`/api/phoenix/dictionaries/code/${code}`, {
      method: 'GET',
    });
  }

  static async createDictionary(data: Dictionary) {
    return request('/api/phoenix/dictionaries', {
      method: 'POST',
      data,
    });
  }

  static async updateDictionary(id: string, data: Dictionary) {
    return request(`/api/phoenix/dictionaries/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteDictionary(id: string) {
    return request(`/api/phoenix/dictionaries/${id}`, {
      method: 'DELETE',
    });
  }

  // 字典项管理
  static async getDictionaryItems(dictionaryId: string) {
    return request(`/api/phoenix/dictionaries/${dictionaryId}/items`, {
      method: 'GET',
    });
  }

  static async createDictionaryItem(dictionaryId: string, data: DictionaryItem) {
    return request(`/api/phoenix/dictionaries/${dictionaryId}/items`, {
      method: 'POST',
      data,
    });
  }

  static async updateDictionaryItem(dictionaryId: string, itemId: string, data: DictionaryItem) {
    return request(`/api/phoenix/dictionaries/${dictionaryId}/items/${itemId}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteDictionaryItem(dictionaryId: string, itemId: string) {
    return request(`/api/phoenix/dictionaries/${dictionaryId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // 登录日志
  static async getLoginLogs(params?: any) {
    return request('/api/phoenix/login-logs', {
      method: 'GET',
      params,
    });
  }

  static async getLoginLog(id: string) {
    return request(`/api/phoenix/login-logs/${id}`, {
      method: 'GET',
    });
  }

  // 操作日志
  static async getOperationLogs(params?: any) {
    return request('/api/phoenix/operation-logs', {
      method: 'GET',
      params,
    });
  }

  static async getOperationLog(id: string) {
    return request(`/api/phoenix/operation-logs/${id}`, {
      method: 'GET',
    });
  }

  // 认证相关
  static async login(username: string, password: string) {
    return request('/api/phoenix/auth/login', {
      method: 'POST',
      data: { username, password },
    });
  }

  static async logout() {
    return request('/api/phoenix/auth/logout', {
      method: 'POST',
    });
  }

  static async getCurrentUser() {
    return request('/api/phoenix/auth/current-user', {
      method: 'GET',
    });
  }

  static async refreshToken() {
    return request('/api/phoenix/auth/refresh-token', {
      method: 'POST',
    });
  }

  // 文件上传
  static async uploadFile(file: File, category?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }
    return request('/api/phoenix/upload', {
      method: 'POST',
      data: formData,
    });
  }

  static async uploadFiles(files: File[], category?: string) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    if (category) {
      formData.append('category', category);
    }
    return request('/api/phoenix/upload/batch', {
      method: 'POST',
      data: formData,
    });
  }

  // 系统参数
  static async getSystemParams(params?: any) {
    return request('/api/phoenix/system-params', {
      method: 'GET',
      params,
    });
  }

  static async getSystemParam(key: string) {
    return request(`/api/phoenix/system-params/${key}`, {
      method: 'GET',
    });
  }

  static async updateSystemParam(key: string, value: any) {
    return request(`/api/phoenix/system-params/${key}`, {
      method: 'PUT',
      data: { value },
    });
  }
}

// 兼容性导出
export const getUsers = PhoenixService.getUsers;
export const getUser = PhoenixService.getUser;
export const createUser = PhoenixService.createUser;
export const updateUser = PhoenixService.updateUser;
export const deleteUser = PhoenixService.deleteUser;

export const getRoles = PhoenixService.getRoles;
export const getRole = PhoenixService.getRole;
export const createRole = PhoenixService.createRole;
export const updateRole = PhoenixService.updateRole;
export const deleteRole = PhoenixService.deleteRole;

export const getPermissions = PhoenixService.getPermissions;
export const getPermission = PhoenixService.getPermission;
export const createPermission = PhoenixService.createPermission;
export const updatePermission = PhoenixService.updatePermission;
export const deletePermission = PhoenixService.deletePermission;

export const getMenus = PhoenixService.getMenus;
export const getMenuTree = PhoenixService.getMenuTree;
export const getMenu = PhoenixService.getMenu;
export const createMenu = PhoenixService.createMenu;
export const updateMenu = PhoenixService.updateMenu;
export const deleteMenu = PhoenixService.deleteMenu;

export const getDictionaries = PhoenixService.getDictionaries;
export const getDictionary = PhoenixService.getDictionary;
export const getDictionaryByCode = PhoenixService.getDictionaryByCode;
export const createDictionary = PhoenixService.createDictionary;
export const updateDictionary = PhoenixService.updateDictionary;
export const deleteDictionary = PhoenixService.deleteDictionary;

export const login = PhoenixService.login;
export const logout = PhoenixService.logout;
export const getCurrentUser = PhoenixService.getCurrentUser;
export const refreshToken = PhoenixService.refreshToken;

export const uploadFile = PhoenixService.uploadFile;
export const uploadFiles = PhoenixService.uploadFiles;

