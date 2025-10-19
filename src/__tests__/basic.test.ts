// 基本测试
describe('基本测试', () => {
  test('1 + 1 应该等于 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('字符串应该正确拼接', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  test('数组应该包含元素', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
    expect(arr).toHaveLength(3);
  });
});

describe('权限测试', () => {
  test('权限常量应该正确定义', () => {
    const { LOCAL_DEV_PERMISSIONS } = require('../constants/permissions');
    expect(LOCAL_DEV_PERMISSIONS).toBeDefined();
    expect(Array.isArray(LOCAL_DEV_PERMISSIONS)).toBe(true);
  });
});
