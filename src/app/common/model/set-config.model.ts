export class SetConfig {
  id?: any;  // 系统id,
  organizationId?: any; // 集团id
  settingCode?: any; // 设置编号
  settingName?: any; // 设置名称
  settingType?: any; // 设置类型
  status?: any; // 设置状态
  idt?: any; // 插入时间
  udt?: any; // 修改时间
}
export class Addconfig {
  settingCode?: any; // 设置编号
  settingName?: any; // 设置名称
  settingType?: any; // 设置类型
}
export class Modifyconfig {
  id?: any;  // 系统id,
  organizationId?: any; // 集团id
  settingCode?: any; // 设置编号
  settingName?: any; // 设置名称
  settingType?: any; // 设置类型
  status?: any; // 设置状态
  idt?: any; // 插入时间
  udt?: any; // 修改时间
}
