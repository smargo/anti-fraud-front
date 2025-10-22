const validators = {
  // 校验前后不能出现空格
  notAllowSpace(value: string) {
    const reg = /^\s+|\s+$/g;
    if (reg.test(value)) {
      return {
        type: 'error',
        message: '输入内容前后不允许有空格',
      };
    }
    return '';
  },
};
export default validators;
