export class ChargeDetail {
  orderId?: any; // 订单编号
  organizationId?: any; // 组织/机构ID
  organizationName?: any; // 组织/机构名称
  villageCode?: any; // 小区编号
  villageName?: any; // 小区名称
  regionCode?: any; // 地块编号
  regionName?: any; // 地块名称
  buildingCode?: any; // 楼栋编号
  buildingName?: any; // 楼栋名称
  unitCode?: any; // 单元编号
  unitName?: any; // 单元名称
  roomCode?: any; // 房屋编号
  roomSize?: any; // 建筑面积
  userId?: any; // 组织id
  surname?: any; // 业主姓名
  mobilePhone?: any; // 客户电话
  payerPhone?: any; // 付款人电话
  payerName?: any; // 付款人姓名
  paymentMethod?: any; // 付款方式
  amountTotalReceivable?: any; // 总应收金额
  actualTotalMoneyCollection?: any; // 总实收金额
  preferentialTotalAmount?: any; // 总优惠金额
  tollCollectorId?: any; // 收费人编号 （不显示）
  // @ts-ignore
  paymentMethod?: any; // 付款方式
  correctedAmount?: any; // 修正金额 / 预存金额
  stateOfArrears?: any; // 付款方式
  refundStatus?: any; // 付款方式
  invalidState?: any; // 付款方式
  tollCollectorName?: any; // 录单人
  remark?: any; // 备注
  idt?: any; // 插入时间
  udt?: any; // 修改时间
  detailed?: ItemDetail[];
}
export class ItemDetail {
  actualMoneyCollection?: any; // 实收金额
  amountReceivable?: any; // 应收金额
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeStandard?: any; // 标准单位
  chargeType?: any; // 计算类型
  chargeUnit?: any; // 单位
  datedif?: any; // 缴费月数
  discont?: any; // 折扣率
  dueTime?: any; // 计费结束时间
  preferentialAmount?: any; // 优惠金额
  startTime?: any; // 计费开始时间
}
