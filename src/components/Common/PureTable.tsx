import { withColumns } from '@/utils';
import { ProColumns, ProTable } from '@ant-design/pro-components';

export default ({
  columns = [],
  dataSource = [],
  options = {},
}: {
  columns: ProColumns[];
  dataSource: any;
  options?: any;
}) => {
  const defaultOptions = {
    search: false,
    options: false,
    pagination: false,
    scroll: { x: 'max-content' },
  };

  const tableOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
    <ProTable
      rowKey="id"
      columns={withColumns(columns)}
      dataSource={dataSource}
      {...tableOptions}
    />
  );
};
