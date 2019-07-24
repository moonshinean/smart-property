export class SetPermission {
  id?: any
  permisCode?: any; // 权限编码
  title?: any; // 权限名称
  roleCode?: any; // 角色编码
  roleName?: any;  // 角色名称
  remark?: any; // 备注
}
export class AddSetPermission {
  permisCode?: any; // 权限编码
  title?: any; // 权限名称
  roleCode?: any; // 角色编码
  roleName?: any;  // 角色名称
  remark?: any; // 备注
}
export class ModifySetPermission {
  permisCode?: any; // 权限编码
  title?: any; // 权限名称
  roleCode?: any; // 角色编码
  roleName?: any;  // 角色名称
  remark?: any; // 备注
}
export class PermitDTO {
  id?: any;
  permisCode?: any;
  title?: any;
  menuPermisFlag?: any;
  permisOrder?: any;
  router?: any;
  parentCode?: any;
  color?: any;
  remark?: any;
  idt?: any;
  udt?: any;
  permitDTO?: PermitDTO[];
}
