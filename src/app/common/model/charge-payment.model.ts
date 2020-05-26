export class Patyment {
  organizationId?: any; // 组织id
  organizationName?: any; // 组织名称
  villageCode?: any; // 小区编号
  villageName?: any; // 小区名称
  regionCode?: any; // 组织id
  regionName?: any; // 组织id
  buildingCode?: any; // 组织id
  buildingName?: any; // 组织id
  unitCode?: any; // 组织id
  unitName?: any; // 组织id
  roomCode?: any; // 组织id
  roomSize?: any; // 组织id
  minMonth?: any; // 最小月份
  customerUserId?: any; // 组织id
  mobilePhone?: any; // 组织id
  surname?: any; // 组织id
  dueTime?: any; // 组织id
  idNumber?: any; // 组织id
  id?: any; // 组织id
  pid?: any; // 组织id
  oneMonthPropertyFee?: any;
}
// 项目选则状态记录
export class ChargeItem {
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  chargeWay?: any; // 项目类型
  datedif?: any; // 项目类型
  check?: any; // 选中状态
  usageAmount?: any; // 度数
  multiple?: any; // 倍数
  minMonth?: any; // 最小月数
  chargeStandards?: any; // 金额下拉框
  chargeStandard?: any; // 金额
  parkingSpaceCode: any;  // 车位编号
}
// 项目选择提交
export class ChargeItemData {
  roomSize?: any; // 房间面积
  dueTime?: any; // 物业费到期时间
  customerUserId?: any; // 客户id
  surplus?: any; // 用户余额
  roomCode?: any; // 房屋编号
  oneMonthPropertyFee?: any;
  chargeItem?: ChargeItems[] = [];

}
// 项目选则
export class ChargeItems {
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  datedif?: any; // 项目类型
  // chargeStandards?: any; // 金额下拉框
  chargeStandard?: any; // 金额
}

// 增加订单
export class ChargePaymentAddOrder {
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
  idNumber?: any; // 身份证号
  payerPhone?: any; // 付款人电话
  payerName?: any; // 付款人姓名
  paymentMethod?: any; // 付款方式
  amountTotalReceivable?: any; // 总应收金额
  actualTotalMoneyCollection?: any; // 总实收金额
  oneMonthPropertyFee?: any;
  surplus?: any; // 修正金额
  correctedAmount?: any; // 修正金额
  remark?: any; // 备注
  billDetailedDOArrayList?: ChargeItemDetail[] = []; // 项目收费明细
  costDeduction?: CostDeduction[] = []; // 项目收费明细
  parkingSpaceCostDetailDOList?: any[];
  paymentMethodDOList?: any[];
}
// 项 目 收 费 详 情
export class ChargeItemDetail {
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
  usageAmount?: any; // 使用量
  currentReadings?: any; // 当前读数
  lastReading?: any; // 上次读数
  stateOfArrears?: any; // 上次读数
  payerPhone?: any;
  payerName?: any;
  customerUserId?: any;
  waterElectricId?: any;
  payerUserId?: any;
  // endTime?: any;
  // arrearsType?: any;
}
export class CostDeduction {
  orderId?: any;
  deductionItem?: any;
  deductionMoney?: any;
  deductionStatus?: any;
  deductionCode?: any;
  deductionOrderId?: any;
  deductionMethod?: any;
  deductionDueTime?: any;
  deductibledMoney?: any;
  surplusDeductibleMoney?: any;
  amountDeductedThisTime?: any;
}
export  class SearchData {
  villageCode: any;
  unitCode: any;
  regionCode: any;
  buildingCode: any;
  roomCode: any;
  pageNo: any;
  pageSize: any;
  mobilePhone: any;
}

// 拆分金额
export  class CostSplitData {
  spiltTime?: any;
  billDetailedId?: any;
  orderId?: any;
  chargeCode?: any;
  chargeName?: any;
  chargeType?: any;
  chargeStandard?: any;
  chargeStandards?: any;
  chargeUnit?: any;
  datedif?: any;
  discount?: any;
  parkingSpaceNature?: any;
  parkingSpaceType?: any;
  amountReceivable?: any;
  actualMoneyCollection?: any;
  usageAmount?: any;
  currentReadings?: any;
  lastReading?: any;
  startTime?: any;
  dueTime?: any;
  stateOfArrears?: any;
  originalStateOfArrears?: any;
  payerPhone?: any;
  payerName?: any;
  payerUserId?: any;
  deductibleMoney?: any;
  deductibledMoney?: any;
  amountDeductedThisTime?: any;
  surplusDeductibleMoney?: any;
  deductionRecord?: any;
  code?: any;
  parentCode?: any;
  splitState?: any;
  oneMonthPropertyFee?: any;
  firstStartTime?: any;
  firstEndTime?: any;
  secondStartTime?: any;
  secondEndTime?: any;
}

// 绑定车位
export class AddSparkSpace {
  parkingSpaceManagementId?: any;
  villageCode?: any;  // 小区编号
  villageName?: any;  // 小区名称
  regionCode?: any;  // 地块编号
  regionName?: any;  // 地块名称
  buildingCode?: any; // 楼宇编号
  buildingName?: any; // 楼宇名称
  unitCode?: any;  // 单元编号
  unitName?: any; // 单元名称
  surname?: any; // 姓名
  idNumber?: any; // 身份证号
  mobilePhone?: any; // 客户电话
  roomCode?: any; // 房间号
  roomSize?: any; // 住房大小 单位：平方米
  organizationId?: any; // 客户ID，唯一标识
  organizationName?: any; // 组织/机构名称
  contractNumber?: any; // 合同编号
  parkingSpaceCode?: any; //  车位编号
  parkingSpaceType?: any; //  车位类型
  authorizedPersonName?: any; // 授权人姓名
  authorizedPersonPhone?: any; // 授权人电话
  authorizedPersonIdNumber?: any; // 授权人身份证号
  licensePlateNumber?: any; // 车牌号
  licensePlateColor?: any; // 车牌颜色
  licensePlateType?: any; // 车牌类型
  vehicleOriginalType?: any; // 车辆原始类型
  startTime?: any; // 开始计费时间
  loggedOffState?: any; // 注销状态
  idt?: any; // 插入时间
  udt?: any;  // 修改时间
}


export class RentalAddSparkSpace {
  contractNumber?: any; // 合同编号
  rentalRenewalStatus?: any;  // 续租状态
  datedif?: any;  // 月份
  villageName?: any;  // 小区名称
  villageCode?: any;  // 小区编号
  regionName?: any;  // 地块名称
  regionCode?: any;  // 地块编号
  buildingName?: any;  // 楼栋名称
  buildingCode?: any;  // 楼栋编号
  parkingSpaceCode?: any;  // 车位编号
  parkingSpaceType?: any;  // 车位类型
  parkingSpacePlace?: any;  // 车位地点
  vehicleOriginalType?: any;  // 车辆原始类型
  licensePlateNumber?: any;  // 车牌编号
  licensePlateType?: any;  // 车牌类型
  licensePlateColor?: any;  // 车牌颜色
  authorizedPersonName?: any;  // 授权人姓名
  authorizedPersonPhone?: any;  // 授权人电话
  authorizedPersonIdNumber?: any;  // 授权人身份证号
  startTime?: any;  // 开始计费时间
  dueTime?: any;  // 结束计费时间
  discount?: any;  // 折扣率
  chargeUnit?: any;  // 收费单位
  chargeStandard?: any;  // 标准单价
  chargeName?: any;  // 项目名称'
  actualMoneyCollection?: any;  // 实收金额
  amountReceivable?: any;  // 应收金额
}
