// @ts-ignore
/* eslint-disable */

declare namespace PhoenixAPI {
  type PageParams = {
    current?: number;
    pageSize?: number;
    // [key: string]: any;
  };
  type ExtraPageParams = {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  };
  type NoResultRespones = {
    message?: string;
    code?: string;
    data: undefined | null;
  };
  type Item = {
    [key: string]: any;
  };
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    // phone?: string;
    nickname?: string;

    id?: string;
    username?: string;
    nickname?: string;
    password?: string;
    phone?: string;
    enabled?: boolean;
    lastLoginTime?: string;
    createTime?: string;
    lastModifiedTime?: string;
    lockExpireTime?: null;
    accountExpireTime?: null;
    credentialExpireTime?: null;
    createBy?: string;
    lastModifiedBy?: string;
    version?: number;
    loginStatus?: null;
    roles?: Array<RoleListItem>;
    userRoleEffectiveTimes?: string;
    roleIds?: Array<string>;
    routers?: Array<MenuTreeItem>;
    permissions: AuthorityListItem[];
    menus: MenuTreeItem[];
    email?: string;
    webpageElementResources?: ResourceListItem[];
  };
  type List = {
    data: Item[];
    total?: number;
    success?: boolean;
    message?: string;
    [key: string]: any;
  };
  type ResourceListItem = {
    id: string;
    name: string;
    url: string;
    description: string;
    categoryId: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
    categoryName: string;
    new: boolean;
    method?: string;
    [key: string]: any;
  };
  type ResourceList = {
    List;
    data: ResourceListItem[];
  };
  type CategoryListItem = {
    id: string;
    name: string;
    displayOrder: number;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
    new: boolean;
    [key: string]: any;
  };
  type CategoryList = {
    List;
    data: CategoryListItem[];
  };
  type SelectItem = {
    label: string;
    value: any;
  };

  type MenuTreeItem = {
    parentId?: string;
    id: string;
    name: string;
    type: string;
    displayOrder: number;
    path: string;
    icon: string;
    fullId: string;
    hidden: boolean;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
    children?: Array<MenuTreeItem>;
    routes?: MenuTreeItem[] | [];
    [key: string]: any;
  };
  type MenuTreeList = {
    code: string;
    data: MenuTreeItem[];
    message: string;
  };

  type RoleListItem = {
    code: string;
    name: string;
    enabled: boolean;
    activeTime: ActiveTime;
    expireTime: ExpireTime;
    id: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
  };

  type RoleList = {
    code: string;
    data: RoleListItem[];
    message: string;
  };

  type RoleLinkAuthListItem = {
    appCode: string;
    // name: string;
    enabled: boolean;
    userId: string;
    roleId: string;
    role: RoleListItem;

    permission: AuthorityListItem;
    permissionId: string;
    menuId: string;
    menu: MenuTreeItem;
    // id: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
  };

  type RoleLinkAuthList = {
    code: string;
    data: RoleLinkAuthListItem[];
    message: string;
  };

  type UserLinkRoleListItem = {
    activeExpireTimeRange: any[];
    appCode: string;
    // name: string;
    enabled: boolean;
    userId: string;
    roleId: string;
    role: RoleListItem;
    user: UserListItem;
    activeTime: ActiveTime;
    expireTime: ExpireTime;
    // id: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
  };

  type UserLinkRoleList = {
    code: string;
    data: UserLinkRoleListItem[];
    message: string;
  };

  type AuthorityListItem = {
    code: string;
    name: string;
    enabled: boolean;
    id: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    type: string;
    version: number;
    menu: MenuTreeItem;
    menuId: string;
  };

  type AuthorityList = {
    code: string;
    data: AuthorityListItem[];
    message: string;
  };

  type DictionaryListItem = {
    // roleKeys: any;
    name: string;
    code: string;
    description: string;
    data: { label?: string; value?: string }[];
    // roles: Array<RoleListItem>;
    systemId: string;
    id: string;
    // createTime: string;
    // lastModifiedTime: string;
    // createBy: string;
    // lastModifiedBy: string;
    // dicArr?: Array<{ key: string; value: string }>;
    // roleKeys?: Array<string>;
  };
  type DictionaryList = {
    code: string;
    data: DictionaryListItem[];
    message: string;
  };

  type ParameterListItem = {
    name: string;
    code: string;
    description: string;
    dataType: string;
    data: string;
    roles: Array<RoleListItem>;
    systemId: string | null;
    id: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string | null;
    roleKeys?: Array<string>;
  };

  type ParameterList = {
    code: string;
    data: Array<ParameterListItem>;
    message: string;
  };

  type UserListItem = {
    username: string;
    nickname: string;
    phone: string;
    enabled: boolean;
    accountExpireTime: string;
    roles?: Array<RoleListItem>;
    id: string;
    loginStatus: boolean;
    lastLoginTime: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    lastLoginIp: string;
    [key: string]: any;
  };
  type UserList = {
    code: string;
    data: Array<UserListItem>;
    message: string;
  };

  type UserRoleLifeTime = {
    id: {
      username: string;
      roleCode: string;
    };
    activeTime: string;
    expireTime: string;
    version: number;
  };

  type TaskModelListItem = {
    taskName: string;
    taskCode: string;
    concurrentStrategy: string;
    exceptionStrategy: string;
    processor: string;
    validator: string;
    contentSeparator: string;
    fileSuffix: string;
    groupIndex: number;
    reviewNeeded: boolean;
    reviewRole: string;
    autorun: boolean;
    fileHeaders: Array<string> | string;
    columns: number;
    maximumRows: number;
    maximumFileSize: number;
    parameters: Array<TaskModelParams>;
    // parameter?:  Array<TaskModelParams>
    roles: null;
    id: string;
    lastLoginTime: null;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    [key: string]: string;
  };

  type TaskModelList = {
    code: string;
    data: Array<TaskModelListItem>;
    message: string;
  };

  type TaskModelParams = {
    id?: string;
    taskCode: string;
    parameterName: string;
    parameterCode: string;
    parameterType: string;
    parameterSource: string;
    required: boolean;
    defaultValue: string;
    readOnly: boolean;
    dictionaries: Array<DictionaryListItem>;
  };

  type BatchTaskCreateParams = {
    taskCode: string;
    fileList: UploadFile[];
    instanceParameters: Record<string, string>;
  };

  type BatchTaskListItem = {
    taskCode: string;
    taskName: string;
    originalFileName: string;
    status: string;
    succeedItems: number;
    failedItems: number;
    totalItems: number;
    parameters: Record<string, any>;
    reviewNeeded: boolean;
    reviewRole: string;
    reviewStatus: string;
    reviewOpinion: string;
    reviewedBy: string;
    id: string;
    batchNo: string;
    startTime: string;
    endTime: string;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
  };

  type BatchTaskList = {
    code: string;
    data: Array<batchTaskListItem>;
    message: string;
  };
  type BatchDataListItem = {
    id: string;
    instanceId: string;
    taskCode: string;
    lineNo: string;
    status: string;
    content: string;
    contentSeparator: string;
    groupIdentifier: string;
    exceptionMessage: string;
    createTime: string;
    lastModifiedTime: string;
    startTime: string;
    endTime: string;
  };
  type BatchDataList = {
    code: string;
    data: Array<BatchDataListItem>;
    message: string;
  };

  type OperationLogListItem = {
    id?: number | string;
    apiUrl: string;
    clientIp: string;
    requestMethod: string;
    description: string;
    queryString: null;
    requestParameter: string;
    invokeMethod: string;
    methodParams: string;
    responseBody: string;
    userName: null;
    startDate: string;
    endDate: string;
    invokeResult: string;
    new: boolean;
  };
  type OperationLogList = {
    code: string;
    data: Array<OperationLogListItem>;
    message: string;
  };

  type LoginLogListItem = {
    id: number;
    userName: string;
    clientIp: string;
    loginTime: string;
    successFlag: boolean;
    behavior: string;
    errMsg: null;
    new: boolean;
  };
  type LoginLogList = {
    code: string;
    data: Array<LoginLogListItem>;
    message: string;
  };

  type FlowNodeConfigListItem = {
    id: string;
    templateCode: string;
    nodeOrder: number;
    auditor: string;
    auditRole: string;
    nodeType: string;
    roleName: string;
    new: boolean;
  };
  type ApprovalModelListItem = {
    id: string;
    templateName: string;
    templateCode: string;
    viewPath: string;
    auditMode: string;
    notifyBean: string;
    stepValidator: string;
    needDataChk: boolean;
    dataChecker: null;
    remark: null;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
    flowNodeConfigList: Array<FlowNodeConfigListItem> | Array<string>;
    new: boolean;
    [key: string]: any;
  };
  type ApprovalModelList = {
    code: string;
    data: Array<ApprovalModelListItem>;
    message: string;
  };
  type ApprovalListItem = {
    bizSeq: string;
    objectId: string;
    bizType: string;
    auditStatus: string;
    bizData: null;
    templateCode: string;
    notifyBean: string;
    stepValidator: string;
    viewPath: string;
    proposer: string;
    auditor: string;
    auditMode: string;
    auditRole: string;
    remark: string;
    applyTime: string;
    lastModifiedTime: string;
    id: string;
    historyTime: string;
    proposerName: string;
    auditorName: string;
    new: boolean;
  };
  type ApprovalList = {
    code: string;
    data: Array<ApprovalListItem>;
    message: string;
  };

  type ApprovalDetail = {
    displayByBiz: boolean;
    auditMode: string;
    auditRole: null;
    viewDataList: Array<Record<string, any>>;
    viewPath: string;
    flowInstances: Array<FlowInstances>;
    [key: string]: any;
  };
  type FlowInstances = {
    nodeId: string;
    orderNo: string;
    nodeOrder: number;
    auditStatus: string;
    auditor: string;
    auditorName: string;
    auditTime: string;
    remark: string;
    [key: string]: any;
  };
  type ApprovalDetailData = {
    code: string;
    data: ApprovalDetail;
    message: string;
  };

  type Qrcode = {
    username: null;
    qrcodeUUid: string;
    qrcodeStatus: string;
    token: string;
    qrcodeLoginUrl: string;
    qrcode: string;
  };
  type QrcodeData = {
    code: string;
    data: Qrcode;
    message: string;
  };
  type LoginConfigData = {
    qrCodeLoginEnabled: boolean;
    captchaEnabled: boolean;
  };
  type RoleDetail = {
    id: string;
    roleCode: string;
    roleName: string;
    enabled: boolean;
    createTime: string;
    lastModifiedTime: string;
    createBy: string;
    lastModifiedBy: string;
    version: number;
    routers: Array<MenuTreeItem>;
    routerIds: Array<string>;
    resources: Array<ResourceListItem>;
    resourceIds: Array<string>;
  };

  type ColumnsSetItem = {
    title: string;
    cellType: string;
    expressionType: string;
    expression: string;
    formatterType: string;
    formatterParam: string;
    remark: string;
  };

  type ExportSetListItem = {
    id: string;
    // code: string;
    name: string;
    remark: string;
    createBy: string;
    createTime: string;
    lastModifiedBy: string;
    lastModifiedTime: string;
    columns: Array<ColumnsSetItem>;
  };
  type ExportSetList = {
    code: string;
    data: Array<ExportSetListItem>;
    message: string;
  };

  type LastExecution = {
    id: number;
    parameters: Record<string, any>;
    status: string;
    startTime: string;
    endTime: string;
    createTime: string;
    lastUpdated: string;
    duration: number;
    exitStatus: string;
    executionContext: Record<string, any>;
    failureExceptions: null;
  };

  type BatchTaskListItem1 = {
    id: string;
    name: string;
    description: null;
    incrementable: boolean;
    restartable: boolean;
    launchable: boolean;
    lastExecution: LastExecution;
  };
  type TaskInstanceItem = {
    id: number;
    jobName: string;
    executionCount: number;
    lastExecution: LastExecution;
  };
  type TaskInstanceExecutionItem = {
    id: number;
    parameters: Record<string, any>;
    status: string;
    startTime: string;
    endTime: null;
    createTime: string;
    lastUpdated: string;
    duration: null;
    exitStatus: string;
    executionContext: Record<string, any>;
    failureExceptions: null;
    stepName: string;
  };

  type InstanceStep = {
    stepName: string;
    status: string;
    readCount: number;
    writeCount: number;
    commitCount: number;
    rollbackCount: number;
    readSkipCount: number;
    processSkipCount: number;
    writeSkipCount: number;
    startTime: string;
    endTime: null;
    createTime: string;
    lastUpdated: string;
    duration: null;
    executionContext: Record<string, any>;
    exitStatus: string;
    terminateOnly: boolean;
    filterCount: number;
    failureExceptions: null;
  };
  type RunParamsItem = {
    key: string;
    value: null;
    type: string;
    required: boolean;
  };
  type RunParamsList = {
    code: string;
    data: Array<RunParamsItem>;
    message: string;
  };
  type BankOrgListItem = {
    bankOrgNbr: string;
    bankOrgName: string;
    [key: string]: any;
  };
  type BankOrgList = {
    List;
    data: BankOrgListItem[];
  };
  type AcctTitleListItem = {
    id: number;
    bankOrgNbr: string;
    glAcctNbr: string;
    glAcctName: string;
    glAcctTypCd: string;
    glAcctLevel: string;
    maintTellerId: string;
  };
  type AcctTitleList = {
    code: string;
    data: Array<AcctTitleListItem>;
    message: string;
  };

  type ServicesListItem = {
    id: string;
    name: string;
    [key: string]: any;
  };

  type MethodsListItem = {
    id: string;
    name: string;
    [key: string]: any;
  };

  type Response = {
    code: string;
    data: any;
    message: string;
  };

  type TimeTaskList = {
    code: string;
    data: Array<{
      id: string;
      name: string;
      [key: string]: any;
    }>;
    message: string;
  };
}
