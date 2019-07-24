export class Toll {
  chargeName?: any; // 项目名称
  chargeCode?: any; // 项目编号
  chargeType?: any; // 项目类型
  chargeUnit?: any; // 收费单位
  chargeStandard?: any; // 收费单价
  refund?: any; // 	是否可退款
  enable ?: any; // 	是否可用
  areaMin?: any; // 	面积最大值
  areaMax?: any; // 	面积最小值
  money?: any; // 	金额
  datedif?: any; // 	月数
  discount?: any; // 	折扣
  parkingSpaceNature?: any; // 		车位性质
  parkingSpaceType ?: any; // 		车位类型
}

export class AddToll {
  id?: any;
  chargeCode?: any; // 项目编号
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  chargeUnit?: any; // 收费单位
  chargeStandard?: any; // 收费单价
  refund?: any; // 	是否可退款
  enable ?: any; // 	是否可用
  areaMin?: any; // 	面积最大值
  areaMax?: any; // 	面积最小值
  money?: any; // 	金额
  datedif?: any; // 	月数
  discount?: any; // 	折扣
  parkingSpaceNature?: any; // 		车位性质
  parkingSpaceType ?: any; // 		车位类型
}
export class ModifyToll {
  chargeName?: any; // 项目名称
  chargeType?: any; // 项目类型
  chargeUnit?: any; // 收费单位
  chargeStandard?: any; // 收费单价
  refund?: any; // 	是否可退款
  enable ?: any; // 	是否可用
  areaMin?: any; // 	面积最大值
  areaMax?: any; // 	面积最小值
  money?: any; // 	金额
  datedif?: any; // 	月数
  discount?: any; // 	折扣
  parkingSpaceNature?: any; // 		车位性质
  parkingSpaceType ?: any; // 		车位类型
}
export class BfTollTitle {
  id?: any;
  chargeName?: any; // 项目名称
  chargeCode?: any; // 项目编号
  chargeType?: any; // 项目类型
  chargeUnit?: any; // 收费单位
  chargeStandard?: any; // 收费单价
  refund?: any; // 	是否可退款
  enable ?: any; // 	是否可用
}
export class TollMoreInfo {
  id?: any;
  areaMin?: any; // 	面积最大值
  areaMax?: any; // 	面积最小值
  money?: any; // 	金额
  datedif?: any; // 	月数
  discount?: any; // 	折扣
  parkingSpaceNature?: any; // 		车位性质
  parkingSpaceType ?: any; // 		车位类型
}
export class ModifyTollDrop {
  datedif: any; // 月数
  parkingSpaceNature?: any; // 		车位性质
  parkingSpaceType ?: any; // 		车位类型
}
