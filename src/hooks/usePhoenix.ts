import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { PhoenixService } from '@/services/phoenix';
import type {
  User,
  Role,
  Permission,
  Menu,
  Dictionary,
  LoginLog,
  OperationLog,
} from '@/services/phoenix';

/**
 * 用户管理 Hook
 */
export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await PhoenixService.getUsers(params);
      setUsers(response || []);
      return response;
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (id: string) => {
    try {
      const response = await PhoenixService.getUser(id);
      setCurrentUser(response);
      return response;
    } catch (error) {
      message.error('获取用户失败');
      console.error('获取用户失败:', error);
      return null;
    }
  }, []);

  const createUser = useCallback(
    async (data: User) => {
      try {
        const response = await PhoenixService.createUser(data);
        message.success('创建用户成功');
        await fetchUsers();
        return response;
      } catch (error) {
        message.error('创建用户失败');
        console.error('创建用户失败:', error);
        throw error;
      }
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (id: string, data: User) => {
      try {
        const response = await PhoenixService.updateUser(id, data);
        message.success('更新用户成功');
        await fetchUsers();
        if (currentUser?.id === id) {
          setCurrentUser(response);
        }
        return response;
      } catch (error) {
        message.error('更新用户失败');
        console.error('更新用户失败:', error);
        throw error;
      }
    },
    [fetchUsers, currentUser],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await PhoenixService.deleteUser(id);
        message.success('删除用户成功');
        await fetchUsers();
        if (currentUser?.id === id) {
          setCurrentUser(null);
        }
      } catch (error) {
        message.error('删除用户失败');
        console.error('删除用户失败:', error);
        throw error;
      }
    },
    [fetchUsers, currentUser],
  );

  const resetPassword = useCallback(async (id: string, newPassword: string) => {
    try {
      await PhoenixService.resetPassword(id, newPassword);
      message.success('重置密码成功');
    } catch (error) {
      message.error('重置密码失败');
      console.error('重置密码失败:', error);
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      await PhoenixService.changePassword(oldPassword, newPassword);
      message.success('修改密码成功');
    } catch (error) {
      message.error('修改密码失败');
      console.error('修改密码失败:', error);
      throw error;
    }
  }, []);

  return {
    users,
    loading,
    currentUser,
    setCurrentUser,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    changePassword,
  };
};

/**
 * 角色管理 Hook
 */
export const useRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await PhoenixService.getRoles(params);
      setRoles(response || []);
      return response;
    } catch (error) {
      message.error('获取角色列表失败');
      console.error('获取角色列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRole = useCallback(async (id: string) => {
    try {
      const response = await PhoenixService.getRole(id);
      setCurrentRole(response);
      return response;
    } catch (error) {
      message.error('获取角色失败');
      console.error('获取角色失败:', error);
      return null;
    }
  }, []);

  const createRole = useCallback(
    async (data: Role) => {
      try {
        const response = await PhoenixService.createRole(data);
        message.success('创建角色成功');
        await fetchRoles();
        return response;
      } catch (error) {
        message.error('创建角色失败');
        console.error('创建角色失败:', error);
        throw error;
      }
    },
    [fetchRoles],
  );

  const updateRole = useCallback(
    async (id: string, data: Role) => {
      try {
        const response = await PhoenixService.updateRole(id, data);
        message.success('更新角色成功');
        await fetchRoles();
        if (currentRole?.id === id) {
          setCurrentRole(response);
        }
        return response;
      } catch (error) {
        message.error('更新角色失败');
        console.error('更新角色失败:', error);
        throw error;
      }
    },
    [fetchRoles, currentRole],
  );

  const deleteRole = useCallback(
    async (id: string) => {
      try {
        await PhoenixService.deleteRole(id);
        message.success('删除角色成功');
        await fetchRoles();
        if (currentRole?.id === id) {
          setCurrentRole(null);
        }
      } catch (error) {
        message.error('删除角色失败');
        console.error('删除角色失败:', error);
        throw error;
      }
    },
    [fetchRoles, currentRole],
  );

  const assignPermissions = useCallback(
    async (roleId: string, permissionIds: string[]) => {
      try {
        await PhoenixService.assignPermissions(roleId, permissionIds);
        message.success('分配权限成功');
        await fetchRoles();
      } catch (error) {
        message.error('分配权限失败');
        console.error('分配权限失败:', error);
        throw error;
      }
    },
    [fetchRoles],
  );

  return {
    roles,
    loading,
    currentRole,
    setCurrentRole,
    fetchRoles,
    fetchRole,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  };
};

/**
 * 权限管理 Hook
 */
export const usePermission = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);

  const fetchPermissions = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await PhoenixService.getPermissions(params);
      setPermissions(response || []);
      return response;
    } catch (error) {
      message.error('获取权限列表失败');
      console.error('获取权限列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermission = useCallback(async (id: string) => {
    try {
      const response = await PhoenixService.getPermission(id);
      setCurrentPermission(response);
      return response;
    } catch (error) {
      message.error('获取权限失败');
      console.error('获取权限失败:', error);
      return null;
    }
  }, []);

  const createPermission = useCallback(
    async (data: Permission) => {
      try {
        const response = await PhoenixService.createPermission(data);
        message.success('创建权限成功');
        await fetchPermissions();
        return response;
      } catch (error) {
        message.error('创建权限失败');
        console.error('创建权限失败:', error);
        throw error;
      }
    },
    [fetchPermissions],
  );

  const updatePermission = useCallback(
    async (id: string, data: Permission) => {
      try {
        const response = await PhoenixService.updatePermission(id, data);
        message.success('更新权限成功');
        await fetchPermissions();
        if (currentPermission?.id === id) {
          setCurrentPermission(response);
        }
        return response;
      } catch (error) {
        message.error('更新权限失败');
        console.error('更新权限失败:', error);
        throw error;
      }
    },
    [fetchPermissions, currentPermission],
  );

  const deletePermission = useCallback(
    async (id: string) => {
      try {
        await PhoenixService.deletePermission(id);
        message.success('删除权限成功');
        await fetchPermissions();
        if (currentPermission?.id === id) {
          setCurrentPermission(null);
        }
      } catch (error) {
        message.error('删除权限失败');
        console.error('删除权限失败:', error);
        throw error;
      }
    },
    [fetchPermissions, currentPermission],
  );

  return {
    permissions,
    loading,
    currentPermission,
    setCurrentPermission,
    fetchPermissions,
    fetchPermission,
    createPermission,
    updatePermission,
    deletePermission,
  };
};

/**
 * 菜单管理 Hook
 */
export const useMenu = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuTree, setMenuTree] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);

  const fetchMenus = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await PhoenixService.getMenus(params);
      setMenus(response || []);
      return response;
    } catch (error) {
      message.error('获取菜单列表失败');
      console.error('获取菜单列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuTree = useCallback(async () => {
    try {
      const response = await PhoenixService.getMenuTree();
      setMenuTree(response || []);
      return response;
    } catch (error) {
      message.error('获取菜单树失败');
      console.error('获取菜单树失败:', error);
      return [];
    }
  }, []);

  const fetchMenu = useCallback(async (id: string) => {
    try {
      const response = await PhoenixService.getMenu(id);
      setCurrentMenu(response);
      return response;
    } catch (error) {
      message.error('获取菜单失败');
      console.error('获取菜单失败:', error);
      return null;
    }
  }, []);

  const createMenu = useCallback(
    async (data: Menu) => {
      try {
        const response = await PhoenixService.createMenu(data);
        message.success('创建菜单成功');
        await fetchMenus();
        await fetchMenuTree();
        return response;
      } catch (error) {
        message.error('创建菜单失败');
        console.error('创建菜单失败:', error);
        throw error;
      }
    },
    [fetchMenus, fetchMenuTree],
  );

  const updateMenu = useCallback(
    async (id: string, data: Menu) => {
      try {
        const response = await PhoenixService.updateMenu(id, data);
        message.success('更新菜单成功');
        await fetchMenus();
        await fetchMenuTree();
        if (currentMenu?.id === id) {
          setCurrentMenu(response);
        }
        return response;
      } catch (error) {
        message.error('更新菜单失败');
        console.error('更新菜单失败:', error);
        throw error;
      }
    },
    [fetchMenus, fetchMenuTree, currentMenu],
  );

  const deleteMenu = useCallback(
    async (id: string) => {
      try {
        await PhoenixService.deleteMenu(id);
        message.success('删除菜单成功');
        await fetchMenus();
        await fetchMenuTree();
        if (currentMenu?.id === id) {
          setCurrentMenu(null);
        }
      } catch (error) {
        message.error('删除菜单失败');
        console.error('删除菜单失败:', error);
        throw error;
      }
    },
    [fetchMenus, fetchMenuTree, currentMenu],
  );

  return {
    menus,
    menuTree,
    loading,
    currentMenu,
    setCurrentMenu,
    fetchMenus,
    fetchMenuTree,
    fetchMenu,
    createMenu,
    updateMenu,
    deleteMenu,
  };
};

/**
 * 字典管理 Hook
 */
export const useDictionary = () => {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDictionary, setCurrentDictionary] = useState<Dictionary | null>(null);

  const fetchDictionaries = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await PhoenixService.getDictionaries(params);
      setDictionaries(response || []);
      return response;
    } catch (error) {
      message.error('获取字典列表失败');
      console.error('获取字典列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDictionary = useCallback(async (id: string) => {
    try {
      const response = await PhoenixService.getDictionary(id);
      setCurrentDictionary(response);
      return response;
    } catch (error) {
      message.error('获取字典失败');
      console.error('获取字典失败:', error);
      return null;
    }
  }, []);

  const fetchDictionaryByCode = useCallback(async (code: string) => {
    try {
      const response = await PhoenixService.getDictionaryByCode(code);
      return response;
    } catch (error) {
      message.error('根据编码获取字典失败');
      console.error('根据编码获取字典失败:', error);
      return null;
    }
  }, []);

  const createDictionary = useCallback(
    async (data: Dictionary) => {
      try {
        const response = await PhoenixService.createDictionary(data);
        message.success('创建字典成功');
        await fetchDictionaries();
        return response;
      } catch (error) {
        message.error('创建字典失败');
        console.error('创建字典失败:', error);
        throw error;
      }
    },
    [fetchDictionaries],
  );

  const updateDictionary = useCallback(
    async (id: string, data: Dictionary) => {
      try {
        const response = await PhoenixService.updateDictionary(id, data);
        message.success('更新字典成功');
        await fetchDictionaries();
        if (currentDictionary?.id === id) {
          setCurrentDictionary(response);
        }
        return response;
      } catch (error) {
        message.error('更新字典失败');
        console.error('更新字典失败:', error);
        throw error;
      }
    },
    [fetchDictionaries, currentDictionary],
  );

  const deleteDictionary = useCallback(
    async (id: string) => {
      try {
        await PhoenixService.deleteDictionary(id);
        message.success('删除字典成功');
        await fetchDictionaries();
        if (currentDictionary?.id === id) {
          setCurrentDictionary(null);
        }
      } catch (error) {
        message.error('删除字典失败');
        console.error('删除字典失败:', error);
        throw error;
      }
    },
    [fetchDictionaries, currentDictionary],
  );

  return {
    dictionaries,
    loading,
    currentDictionary,
    setCurrentDictionary,
    fetchDictionaries,
    fetchDictionary,
    fetchDictionaryByCode,
    createDictionary,
    updateDictionary,
    deleteDictionary,
  };
};

/**
 * 认证相关 Hook
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await PhoenixService.login(username, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      message.success('登录成功');
      return response;
    } catch (error) {
      message.error('登录失败');
      console.error('登录失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await PhoenixService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      message.success('退出登录成功');
    } catch (error) {
      message.error('退出登录失败');
      console.error('退出登录失败:', error);
      throw error;
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await PhoenixService.getCurrentUser();
      setCurrentUser(response);
      setIsAuthenticated(!!response);
      return response;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await PhoenixService.refreshToken();
      return response;
    } catch (error) {
      console.error('刷新令牌失败:', error);
      throw error;
    }
  }, []);

  // 初始化时获取当前用户
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return {
    currentUser,
    loading,
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    refreshToken,
  };
};

/**
 * 文件上传 Hook
 */
export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File, category?: string) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const response = await PhoenixService.uploadFile(file, category);
      message.success('文件上传成功');
      return response;
    } catch (error) {
      message.error('文件上传失败');
      console.error('文件上传失败:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[], category?: string) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const response = await PhoenixService.uploadFiles(files, category);
      message.success(`成功上传 ${files.length} 个文件`);
      return response;
    } catch (error) {
      message.error('批量文件上传失败');
      console.error('批量文件上传失败:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadFiles,
  };
};
