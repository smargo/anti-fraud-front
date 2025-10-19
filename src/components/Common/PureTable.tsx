import { withColumns } from '@/utils';
import { ProTable, ProColumns } from '@ant-design/pro-components';

interface PureTableProps {
  columns: ProColumns[];
  dataSource: any;
  options?: any;
}

const PureTable: React.FC<PureTableProps> = ({ columns = [], dataSource = [], options = {} }) => {
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

export default PureTable;

