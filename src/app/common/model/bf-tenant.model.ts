export class Tenant {
  villageName?: string; // 小区名称
  regionName?: string; // 地块名称
  buildingName?: string; // 楼栋名称
  unitName?: string; // 单元名称
  roomCode?: string; // 房间编号
  roomSize?: string; // 使用面积
  roomType?: string; // 房屋类型
  roomStatus?: string; // 房间状态
  renovationStatus?: string; // 装修情况
  surname?: string; // 业主姓氏
  renovationDeadline?: string; // 装修结束日期
  renovationStartTime?: string; // 装修开始日期
  sex?: string; // 性别
  mobilePhone?: number; // 手机号
  remarks?: any; // 备注
}
export class AddTenant {
  villageName?: string; // 小区名称
  villageCode?: string; // 小区名称
  regionName?: string; // 地块名称
  regionCode?: string; // 地块名称
  buildingName?: string; // 楼栋名称
  buildingCode?: string; // 楼栋名称
  unitName?: string; // 单元名称
  unitCode?: string; // 单元名称
  roomCode?: string; // 房间编号
  roomSize?: string; // 使用面积
  roomType?: string; // 房屋类型
  roomStatus?: string; // 房间状态
  renovationStatus?: string; // 装修情况
  renovationDeadline?: string; // 装修结束日期
  renovationStartTime?: string; // 装修开始日期
  surname?: any;
  sex?: any;
  mobilePhone?: any;
  remarks?: any;
  identity?: any;
  normalPaymentStatus?: any;
}
export class ModifyTenant {
  villageName?: string; // 小区名称
  regionName?: string; // 地块名称
  buildingName?: string; // 楼栋名称
  unitName?: string; // 单元名称
  roomCode?: string; // 房间编号
  roomSize?: string; // 使用面积
  roomType?: string; // 房屋类型
  roomStatus?: string; // 房间状态
  renovationStatus?: string; // 装修情况
  renovationDeadline?: string; // 装修结束日期
  renovationStartTime?: string; // 装修开始日期
  surname?: any;
  sex?: any;
  mobilePhone?: any;
  remarks?: any;
  identity?: any;
  normalPaymentStatus?: any;
}


export class RoomTitle {
  villageName?: any;
  regionName?: any;
  buildingName?: any;
  unitName?: any;
  roomCode?: any;
  roomSize?: any;
  roomType?: any;
  roomStatus?: any;
  renovationStatus?: any;
  renovationStartTime?: any;
  renovationDeadline?: any;
}
export class OwerList {
  surname?: any;
  sex?: any;
  mobilePhone?: any;
  remarks?: any;
  identity?: any;
  normalPaymentStatus?: any;
  startTime?: any;  // 租房开始时间
  endTime?: any;   // 祖租房结束时间
  idNumber?: any;
  roomCode: any;
  customerUserId: any;
}
