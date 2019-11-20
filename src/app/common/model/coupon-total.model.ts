export class CouponTotal {
  organizationId?: any;
  organizationName?: any;
  villageCode?: any; // 小区编号
  villageName?: any ; // 小区名称
  regionCode?: any;
  regionName?: any;
  buildingCode?: any;
  buildingName?: string; // 楼栋名称
  unitCode?: string; // 单元名称
  unitName?: string; // 单元名称
  roomCode?: string; // 房间编号
  couponCode?: string; // 优惠券编号
  couponName?: string; // 优惠券名称
  userId?: string; // 用户id
  surname?: string; // 客户姓名
  mobilePhone?: string; // 客户电话
  money?: string; // 	优惠金额
  effectiveTime?: string; // 		有效时长
  couponType?: string; // 优惠卷类型
  remarks?: string; // 备注
  balanceAmount?: string; // 抵扣物业费金额
  usageState?: string; // 神域金额
  pastDue?: string; // 使用状态
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  auditStatus?: string; // 审核和状态
  propertyFee?: string; // 抵扣物业费金额
  // chargeCode?: string; // 收费项目
}
export class AddCouponTotal {
  organizationId?: any;
  villageCode?: any; // 小区编号
  villageName?: any ; // 小区名称
  regionCode?: any;
  regionName?: any;
  buildingCode?: any;
  buildingName?: string; // 楼栋名称
  unitCode?: string; // 单元名称
  unitName?: string; // 单元名称
  roomCode?: string; // 房间编号
  couponCode?: string; // 优惠券编号
  couponName?: string; // 优惠券名称
  userId?: string; // 用户id
  surname?: string; // 客户姓名
  mobilePhone?: string; // 客户电话
  money?: string; // 	优惠金额
  effectiveTime?: any; // 		有效时长
  couponType?: string; // 优惠卷类型
  remarks?: string; // 备注
  chargeCode?: string; // 收费项目编号
}
// export class SearchCoupon {
//   villageCode: any;
//   unitCode: any;
//   regionCode: any;
//   buildingCode: any;
//   roomCode: any;
//   pageNo: any;
//   pageSize: any;
//   mobilePhone: any;
// }
