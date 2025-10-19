import { Dropdown } from 'antd';
import type { DropdownProps } from 'antd/es/dropdown';
import React from 'react';

const HeaderDropdown: React.FC<DropdownProps> = ({ children, ...restProps }) => {
  return (
    <Dropdown placement="bottomRight" arrow {...restProps}>
      {children}
    </Dropdown>
  );
};

export default HeaderDropdown;

