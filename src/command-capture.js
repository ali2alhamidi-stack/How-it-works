(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WOCommandCapture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clone=v=>JSON.parse(JSON.stringify(v));
  function create(model,inventory){
    let enabled=false,depth=0,actions=[];
    const map={
      createOrder:(a,r)=>['order.create',{data:a[2],clientId:r.id}],updateOrder:a=>['order.update',{id:a[2],patch:a[3]}],assignTeam:a=>['order.team',{id:a[2],team:a[3]}],transitionOrder:a=>['order.transition',{id:a[2],status:a[3]}],
      acceptAssignment:a=>['task.accept',{id:a[2]}],completeAssignment:a=>['task.complete',{id:a[2],minutes:a[3]}],addOrderNote:a=>['order.note',{id:a[2],text:a[3]}],addOrderAttachment:a=>['order.photo',{id:a[2],attachment:a[3]}],addOrderCost:(a,r)=>['order.cost.add',{id:a[2],data:a[3],clientId:r.id}],reverseOrderCost:a=>['order.cost.reverse',{id:a[2],costId:a[3],reason:a[4]}],
      consumeMaterial:a=>['material.consume',{orderId:a[2],data:a[3]}],reserveRemnant:a=>['remnant.reserve',{id:a[2],orderId:a[3]}],releaseRemnant:a=>['remnant.release',{id:a[2]}],
      createPurchase:(a,r)=>['purchase.create',{data:a[2],clientId:r.id}],approvePurchase:a=>['purchase.approve',{id:a[2]}],rejectPurchase:a=>['purchase.reject',{id:a[2]}],receivePurchase:a=>['purchase.receive',{id:a[2]}]
    };
    const inventoryMap={createMaterial:(a,r)=>['material.create',{data:{...a[2],id:r.id}}],updateMaterial:a=>['material.update',{id:a[2],patch:a[3]}],adjust:a=>['material.adjust',{id:a[2],quantity:a[3],reason:a[4]}],reserve:a=>['material.reserve',{id:a[2],orderId:a[3],quantity:a[4]}],release:a=>['material.release',{reservationId:a[2]}],issue:a=>['material.consume',{orderId:a[2],data:a[3]}],receivePurchase:a=>['purchase.receive',{id:a[2]}],transfer:a=>['material.transfer',{id:a[2],toBranchId:a[3],quantity:a[4],reason:a[5]}]};
    function wrap(object,methods){if(!object)return;for(const [name,mapper] of Object.entries(methods)){const original=object[name];if(typeof original!=='function')continue;object[name]=function(...args){const outer=depth===0;depth++;try{const result=original.apply(this,args);if(enabled&&outer){const [type,payload]=mapper(args,result);actions.push({type,payload:clone(payload)});}return result;}finally{depth--;}};}}
    wrap(model,map);wrap(inventory,inventoryMap);
    function custom(action,id,state){if(!enabled)return;const find=(key)=>clone(state[key].find(x=>x.id===id));let entry;
      switch(action){
        case 'create_client':entry=['client.create',{data:find('clients')}];break;
        case 'create_branch':entry=['branch.create',{data:find('branches')}];break;
        case 'update_branch':{const branch=find('branches');entry=['branch.update',{id,patch:Object.fromEntries(['name','city','address','active'].filter(key=>branch[key]!==undefined).map(key=>[key,branch[key]]))}];break;}
        case 'create_material':entry=['material.create',{data:find('materials')}];break;
        case 'create_remnant':entry=['remnant.create',{data:find('remnants')}];break;
        case 'update_brand':entry=['brand.update',{patch:clone(state.brand)}];break;
        case 'update_pricing':entry=['pricing.update',{pricing:clone(state.settings.pricing)}];break;
        case 'update_prices':entry=['service-prices.update',{prices:clone(state.settings.servicePrices)}];break;
        case 'update_performance':entry=['performance.update',{weights:clone(state.settings.performance)}];break;
        case 'update_connections':entry=['connections.update',{publicBaseUrl:state.settings.publicBaseUrl||'',apiBaseUrl:state.settings.apiBaseUrl||''}];break;
        case 'update_permissions':entry=['user.permissions',{id,permissions:find('users').permissions}];break;
        case 'create_user':case 'update_user':throw new Error('إدارة الحسابات تتطلب الاتصال المباشر بالخادم');
        default:throw new Error('هذه العملية غير مربوطة بالخادم: '+action);
      }
      actions.push({type:entry[0],payload:entry[1]});
    }
    return {start(){actions=[];enabled=true;},finish(){enabled=false;return clone(actions);},cancel(){enabled=false;actions=[];},custom};
  }
  return {create};
});
