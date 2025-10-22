// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

// /** 获取分类列表 GET /security/resCategory/listAll */
// export async function categoryList(params = {}, options?: { [key: string]: any }) {
//   return request<PhoenixAPI.CategoryList>('/security/resCategory/listAll', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

/** 审批模板列表 GET /security/resource/listPage */
export async function approvalModelList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.ApprovalModelList>('/audit-flow/template/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

// 历史审批
export async function approvalHistoryList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current, filter: 'history' });
  return request<PhoenixAPI.ApprovalList>('/audit-flow/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

// 我提交的
export async function approvalSubmitList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params, pageNo: params.current, filter: 'submitted' });
  return request<PhoenixAPI.ApprovalList>('/audit-flow/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}
// 我审批的
export async function approvalMyList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params, pageNo: params.current, filter: 'audited-by-me' });
  return request<PhoenixAPI.ApprovalList>('/audit-flow/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}
// 待审批
export async function approvalTodoList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current, filter: 'wait-for-me-audit' });
  return request<PhoenixAPI.ApprovalList>('/audit-flow/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 审批详情 */
export async function approvalInfo(id: string, options?: { [key: string]: any }) {
  return request<PhoenixAPI.ApprovalDetailData>(`/audit-flow/${id}?strategy=CURRENT_PRIOR_HIS`, {
    method: 'GET',
    ...(options || {}),
  });
}
/** 审批同意、拒绝 */
export async function agreeApproval(data: Record<string, any>, options?: { [key: string]: any }) {
  return request<PhoenixAPI.ApprovalDetailData>(`/audit-flow/${data.id}/audit`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 撤销审批 POST /security/resource/update */
export async function cancelApproval(id: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/audit-flow/${id}/cancel`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 编辑审批模板 POST /security/resource/update */
export async function updateApprovalModel(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/audit-flow/template/${data.id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 添加审批模板 POST /security/resource/create */
export async function addApprovalModel(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/audit-flow/template', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除审批模板 DELETE /phoenix/security/resource */
export async function removeApprovalModel(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/audit-flow/template?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
