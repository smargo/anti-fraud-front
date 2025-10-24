/**
 * 事件指标配置Tab组件 - 完全按照原页面逻辑实现
 */

import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import React from 'react';
import { dataSourceApi, DataSourceDO } from '../../services/dataSourceApi';
import {
  deleteEventIndicator,
  queryEventIndicatorsWithNames,
} from '../../services/eventIndicatorConfigApi';
import { indicatorApi, IndicatorDO } from '../../services/indicatorApi';
import { statementApi, StatementVO } from '../../services/statementApi';
import type { EventIndicatorConfigTabProps, EventIndicatorItem } from '../../types';
import EventIndicatorModal from './EventIndicatorModal';

const EventIndicatorConfigTab: React.FC<EventIndicatorConfigTabProps> = ({
  eventNo,
  versionCode,
  isReadOnly,
  actionRef,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingEventIndicator, setEditingEventIndicator] =
    React.useState<EventIndicatorItem | null>(null);

  // 指标详情弹窗状态
  const [indicatorDetailVisible, setIndicatorDetailVisible] = React.useState(false);
  const [selectedIndicator, setSelectedIndicator] = React.useState<IndicatorDO | null>(null);
  const [selectedStatement, setSelectedStatement] = React.useState<StatementVO | null>(null);
  const [selectedDataSource, setSelectedDataSource] = React.useState<DataSourceDO | null>(null);

  // 显示指标详情
  const showIndicatorDetail = async (record: any) => {
    try {
      // 根据指标编号获取完整的指标信息
      const indicatorDetail = await indicatorApi.getByIndicatorNo(record.indicatorNo);
      setSelectedIndicator(indicatorDetail.data);

      // 如果有查询编号，获取关联的语句信息
      if (indicatorDetail.data.queryNo) {
        try {
          const statementDetail = await statementApi.getByStatementNo(indicatorDetail.queryNo);
          setSelectedStatement(statementDetail.data);

          // 如果有数据源编号，获取数据源信息
          if (statementDetail.data.dataSourceNo) {
            try {
              const dataSourceDetail = await dataSourceApi.getByDataSourceNo(
                statementDetail.dataSourceNo,
              );
              setSelectedDataSource(dataSourceDetail.data);
            } catch (error) {
              console.warn('获取数据源信息失败:', error);
              message.error(error?.message || '获取数据源信息失败');
              setSelectedDataSource(null);
            }
          } else {
            setSelectedDataSource(null);
          }
        } catch (error) {
          console.warn('获取关联语句信息失败:', error);
          message.error(error?.message || '获取关联语句信息失败');
          setSelectedStatement(null);
          setSelectedDataSource(null);
        }
      } else {
        setSelectedStatement(null);
        setSelectedDataSource(null);
      }

      setIndicatorDetailVisible(true);
    } catch (error) {
      console.error('获取指标详情失败:', error);
      message.error(error?.message || '获取指标详情失败');
    }
  };

  // 事件指标相关处理
  const handleEventIndicatorAdd = () => {
    setEditingEventIndicator(null);
    setModalVisible(true);
  };

  const handleEventIndicatorEdit = (record: EventIndicatorItem) => {
    setEditingEventIndicator(record);
    setModalVisible(true);
  };

  const handleEventIndicatorDelete = async (id: string) => {
    try {
      const response = await deleteEventIndicator(id);
      if (response.code === '0') {
        message.success('删除成功');
        actionRef?.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const handleEventIndicatorSubmit = async (values: any) => {
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  // 事件指标列定义 - 完全按照原页面
  const eventIndicatorColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
      search: false,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 150,
      render: (indicatorNo: string, record: any) => (
        <Tooltip title="请点击查看" placement="topLeft">
          <a
            onClick={() => showIndicatorDetail(record)}
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {indicatorNo}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      search: false,
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 150,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: EventIndicatorItem) => (
        <Space size="middle">
          <a
            onClick={isReadOnly ? undefined : () => handleEventIndicatorEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个事件指标吗？"
            onConfirm={() => handleEventIndicatorDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={
                isReadOnly
                  ? undefined
                  : () => {
                      console.log('开始删除指标关联');
                    }
              }
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 无版本显示
  const NoVersionDisplay = () => (
    <div
      style={{
        marginBottom: 16,
        padding: 24,
        background: '#fafafa',
        borderRadius: 4,
        textAlign: 'center',
        border: '1px dashed #d9d9d9',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
      </div>
      <div style={{ color: '#999' }}>请先创建版本，然后开始配置事件信息</div>
    </div>
  );

  // 版本信息显示 - 原页面返回null，不显示版本信息
  const VersionInfoDisplay = () => null;

  // 无版本选择显示
  const NoVersionSelectedDisplay = () => (
    <div
      style={{
        marginBottom: 16,
        padding: 24,
        background: '#fafafa',
        borderRadius: 4,
        textAlign: 'center',
        border: '1px dashed #d9d9d9',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>请先选择一个版本进行编辑</span>
      </div>
      <div style={{ color: '#999' }}>在版本控制面板中选择要编辑的版本</div>
    </div>
  );

  // 检查是否应该显示编辑界面 - 完全按照原页面逻辑
  const showEditInterface = versionCode && versionCode.length > 0;

  return (
    <div>
      {/* 根据状态显示不同的界面 - 完全按照原页面逻辑 */}
      {!versionCode ? (
        <NoVersionDisplay />
      ) : !showEditInterface ? (
        <>
          <VersionInfoDisplay />
          <NoVersionSelectedDisplay />
        </>
      ) : (
        <>
          <VersionInfoDisplay />
          <ProTable
            actionRef={actionRef}
            columns={eventIndicatorColumns}
            request={async (params) => {
              const response = await queryEventIndicatorsWithNames({
                ...params,
                eventNo: eventNo,
                versionCode: versionCode,
              });
              return response;
            }}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleEventIndicatorAdd}
                key="add"
                disabled={isReadOnly}
              >
                新增事件指标
              </Button>,
            ]}
          />
        </>
      )}

      {/* 事件指标编辑Modal */}
      <EventIndicatorModal
        visible={modalVisible}
        editingEventIndicator={editingEventIndicator}
        eventNo={eventNo}
        versionCode={versionCode}
        forceReset={!editingEventIndicator}
        onSubmit={handleEventIndicatorSubmit}
        onCancel={() => setModalVisible(false)}
      />

      {/* 指标详情弹窗 */}
      <Modal
        title="指标详情"
        open={indicatorDetailVisible}
        onCancel={() => setIndicatorDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIndicatorDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedIndicator && (
          <div>
            {/* 指标详情卡片 */}
            <Card
              title={
                <Typography.Title level={4} style={{ margin: 0 }}>
                  指标信息
                </Typography.Title>
              }
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标编号：</strong>
                    <Tag color="blue">{selectedIndicator.indicatorNo}</Tag>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标名称：</strong>
                    <span>{selectedIndicator.indicatorName || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>查询编号：</strong>
                    <span>{selectedIndicator.queryNo || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>指标字段：</strong>
                    <span>{selectedIndicator.indicatorField || '-'}</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <strong>创建时间：</strong>
                    <span>
                      {moment(selectedIndicator.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>创建人：</strong>
                    <span>{selectedIndicator.createdBy || '-'}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>最后修改：</strong>
                    <span>
                      {selectedIndicator.lastModifiedDate
                        ? moment(selectedIndicator.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
                        : '--'}
                    </span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <strong>最后修改人：</strong>
                    <span>
                      {selectedIndicator.lastModifiedBy ? selectedIndicator.lastModifiedBy : '-'}
                    </span>
                  </div>
                </Col>
              </Row>

              <div style={{ marginTop: 16 }}>
                <strong>指标描述：</strong>
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 4,
                    minHeight: 40,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {selectedIndicator.indicatorDesc || '-'}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <strong>查询字段：</strong>
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4,
                    minHeight: 40,
                  }}
                >
                  {selectedIndicator.queryField || '-'}
                </div>
              </div>
            </Card>

            {/* 关联语句信息卡片 */}
            <Card
              title={
                <Typography.Title level={4} style={{ margin: 0 }}>
                  关联语句信息-{selectedStatement?.statementNo}
                </Typography.Title>
              }
              style={{ marginBottom: 16 }}
            >
              {selectedStatement ? (
                <div>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color="blue">语句编号：</Tag>
                        <span>{selectedStatement.statementNo}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>语句ID：</strong>
                        <span>{selectedStatement.id}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>语句描述：</strong>
                        <span>{selectedStatement.statementDesc || '未设置'}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>数据源编号：</strong>
                        <span>{selectedStatement.dataSourceNo || '未设置'}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Bean ID：</strong>
                        <span>{selectedStatement.beanId || '未设置'}</span>
                      </div>
                      {/* MongoDB特殊字段 */}
                      {selectedDataSource?.dataSourceType === 'MongoDB' && (
                        <>
                          <div style={{ marginBottom: 8 }}>
                            <strong>MongoDB操作类型：</strong>
                            <Tag color="green">
                              {selectedStatement.mongoOperationType || '未设置'}
                            </Tag>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                  {selectedDataSource?.dataSourceType === 'MongoDB' && (
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>MongoDB数据库：</strong>
                          <span>{selectedStatement.mongoDatabase || '未设置'}</span>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: 8 }}>
                          <strong>MongoDB集合：</strong>
                          <span>{selectedStatement.mongoCollection || '未设置'}</span>
                        </div>
                      </Col>
                    </Row>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <strong>结果字段：</strong>
                    <pre
                      style={{
                        marginTop: 4,
                        padding: 8,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        maxHeight: '100px',
                        overflow: 'auto',
                        border: '1px solid #d9d9d9',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        margin: 0,
                      }}
                    >
                      {selectedStatement.resultList || '暂无结果字段'}
                    </pre>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}
                    >
                      <strong>语句内容：</strong>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          Modal.info({
                            title: '语句内容详情',
                            width: '80%',
                            content: (
                              <pre
                                style={{
                                  background: '#f5f5f5',
                                  padding: '16px',
                                  borderRadius: '6px',
                                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  margin: 0,
                                  maxHeight: '70vh',
                                  overflow: 'auto',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                {selectedStatement.statementString || '暂无语句内容'}
                              </pre>
                            ),
                            okText: '关闭',
                          });
                        }}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        查看详情
                      </Button>
                    </div>
                    <pre
                      style={{
                        marginTop: 4,
                        padding: 8,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        maxHeight: '100px',
                        overflow: 'auto',
                        border: '1px solid #d9d9d9',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        margin: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        Modal.info({
                          title: '语句内容详情',
                          width: '80%',
                          content: (
                            <pre
                              style={{
                                background: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '6px',
                                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                margin: 0,
                                maxHeight: '70vh',
                                overflow: 'auto',
                                border: '1px solid #d9d9d9',
                              }}
                            >
                              {selectedStatement.statementString || '暂无语句内容'}
                            </pre>
                          ),
                          okText: '关闭',
                        });
                      }}
                      title="点击查看完整语句内容"
                    >
                      {selectedStatement.statementString || '暂无语句内容'}
                    </pre>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}
                    >
                      <strong>参数配置：</strong>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          Modal.info({
                            title: '参数配置详情',
                            width: '80%',
                            content: (
                              <pre
                                style={{
                                  background: '#f5f5f5',
                                  padding: '16px',
                                  borderRadius: '6px',
                                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  margin: 0,
                                  maxHeight: '70vh',
                                  overflow: 'auto',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                {selectedStatement.statementParam || '暂无参数配置'}
                              </pre>
                            ),
                            okText: '关闭',
                          });
                        }}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        查看详情
                      </Button>
                    </div>
                    <pre
                      style={{
                        marginTop: 4,
                        padding: 8,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        maxHeight: '60px',
                        overflow: 'auto',
                        border: '1px solid #d9d9d9',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        margin: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        Modal.info({
                          title: '参数配置详情',
                          width: '80%',
                          content: (
                            <pre
                              style={{
                                background: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '6px',
                                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                margin: 0,
                                maxHeight: '70vh',
                                overflow: 'auto',
                                border: '1px solid #d9d9d9',
                              }}
                            >
                              {selectedStatement.statementParam || '暂无参数配置'}
                            </pre>
                          ),
                          okText: '关闭',
                        });
                      }}
                      title="点击查看完整参数配置"
                    >
                      {selectedStatement.statementParam || '暂无参数配置'}
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  暂无关联语句信息
                </div>
              )}
            </Card>

            {/* 数据源信息卡片 */}
            <Card
              title={
                <Typography.Title level={4} style={{ margin: 0 }}>
                  数据源信息-{selectedDataSource?.dataSourceNo}
                </Typography.Title>
              }
            >
              {selectedDataSource ? (
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源编号：</strong>
                      <Tag color="blue">{selectedDataSource.dataSourceNo}</Tag>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源名称：</strong>
                      <span>{selectedDataSource.dataSourceName || '未设置'}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>数据源类型：</strong>
                      <span>{selectedDataSource.dataSourceType || '未设置'}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>用户名：</strong>
                      <span>{selectedDataSource.dataSourceUserName || '未设置'}</span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>连接字符串：</strong>
                      <div
                        style={{
                          marginTop: 4,
                          padding: '8px 12px',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          wordBreak: 'break-all',
                          maxHeight: '100px',
                          overflow: 'auto',
                        }}
                      >
                        {selectedDataSource.dataSourceConnectString || '未设置'}
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>
                  {selectedStatement?.dataSourceNo ? '数据源信息获取失败' : '暂无数据源信息'}
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventIndicatorConfigTab;
