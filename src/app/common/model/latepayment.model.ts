export class LatePayment {
  orderId?: any; // 订单号
  organizationId?: any; // 组织机构ID
  organizationName?: any; // 组织名称
  villageCode?: any; // 小区编号
  villageName?: any; // 小区名称
  regionCode?: any; // 地块编号
  regionName?: any; // 小区名称
  buildingCode?: any; // 楼栋编号
  buildingName?: any; // 楼栋名称
  unitCode?: any; // 单元编号
  unitName?: any; // 单元名称
  roomCode?: any; // 房间编号
  roomSize?: any; // 建筑面积
  userId?: any; // 客户id
  surname?: any; // 客户姓
  mobilePhone?: any; // 手机号
  liquidatedDamages?: LiquidatedDamages[]; // 违约金详情
  amountTotalReceivable?: any; // 应收总金额
  actualTotalMoneyCollection?: any; // 实收总金额
  surplusTotal?: any; // 减免金额
  surplusReason?: any; // 减免原因
  auditStatus?: any; // 审核状态
  tollCollectorId?: any; // 操作人ID
  reviserId?: any; // 修订人
  auditId?: any; // 	审核人
  retrialId?: any; // 	复核人
  remark?: any; // 	备注
  startTime?: any; // 	物业费开始计费时间
  dueTime?: any; // 	物业费计费结束时间
  propertyActualMoneyCollection?: any; // 	物业费金额
  month?: any; // 	物业费月数
  idt?: any; // 插入时间
  udt?: any; // 修改时间
}

export class LiquidatedDamages {
  amountMoney?: any; // 金额
  days?: any; // 天数
  dueTimeAfter?: any; // 季度末
  dueTimeFront?: any; // 季度初
}

// 分页查询
export class LatePaymentQueryData {
  roomCode?: any;
  mobilePhone?: any;
  pageNo?: any;
  pageSize?: any;
}
