
import {createReducer, on} from '@ngrx/store';
import {FALSE, TRUE} from './loadstatus.actions';

// 设置初始值
const initstate = true;

// const _counterReducer = createReducer(initstate,
//   (TRUE, state => true),
//   (FALSE, state => false),
// );


export function counterReducer(state = initstate, action: { type: any; }) {
  // 判断不同的状态做不同的数据处理
  switch (action.type) {
    case TRUE:  return  true;
    case FALSE : return  false;
    default:  return state;
  }
  // return _counterReducer(state, action);
}
