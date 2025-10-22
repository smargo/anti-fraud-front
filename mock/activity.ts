const activityLlist = [
  {
    id: 1221,
    name: '很长的名字78347278782y8328yyhdwyh8',
    activityDesc: '很长的介绍78347278782y8328yyhdwyh8很长的介绍78347278782y8328yyhdwyh8',
  },
];

export default {
  'POST /tmp/activity/manager/list': {
    code: '0',
    message: 'SUCCESS',
    data: {
      pageSize: 20,
      pageNo: 1,
      totalCount: 100,
      result: activityLlist,
    },
  },
};
