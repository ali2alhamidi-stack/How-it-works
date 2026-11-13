# Shared implementation contract

All JavaScript is dependency-free UMD: assign `globalThis.WOModel`, `globalThis.WOCalc`, `globalThis.WOCatalog`; export module.exports in Node. Source files bundled into standalone index.html by build.py. No imports/fetch at app runtime. All user strings escaped at rendering boundaries.

## Model state
`seed(now = new Date())` returns {schemaVersion:1, brand:{name:'آرت بلس للطباعة',activity:'الدعاية والإعلان',primary:'#5B248C',secondary:'#16B6B5',currency:'SAR',footer:'',logo:''}, branches, users, clients, orders, materials, remnants, purchases, reviews, audit, drafts, settings}.
branches: {id,name,city,address,active} ids b1 b2 b3.
users: {id,name,role,branchIds,permissions,jobTitle,targetMonthly,active}; ids owner, manager1, emp1, emp2, emp3, buyer. role owner|manager|employee|purchasing. `permissions` is optional explicit override map permission:boolean.
clients: {id,name,phone,company,branchId}.
orders: {id,number,branchId,clientId,title,category,description,quantity,width,height,unit,materialId,salePrice,estimatedCost,actualCost,dueAt,status,priority,designApproved,designDataUrl,assignees:[{userId,share,plannedMinutes,actualMinutes,dueAt,acceptedAt,done,completedAt}],notes:[{id,userId,text,at}],attachments:[{id,name,dataUrl,at}],consumptions:[],createdAt,deliveredAt,reviewToken,qualityPassed}.
status: draft|approval|queued|production|quality|ready|delivered|cancelled.
priority: normal|urgent|high.
materials: {id,branchId,name,category,unit,quantity,minQuantity,unitCost,supplier,width,height,thickness,color}.
remnants: {id,branchId,materialId,name,width,height,thickness,color,location,sourceOrderId,confirmedBy,status:'available'|'reserved'|'used',reservedFor,createdAt}; dimensions cm.
purchases: {id,number,branchId,title,materialId,quantity,unitCost,status:'requested'|'approved'|'received'|'rejected',requestedBy,approvedBy,receivedAt,note,createdAt}.
reviews: {id,orderId,branchId,token,rating,name,comment,createdAt}.
audit: {id,at,actorId,branchId,action,entityId,detail}.
settings: {performance:{onTimeWeight:50,qualityWeight:30,outputWeight:20},pricing:{letterMinHeight:1,logoMultiplier:2,markup:35},publicBaseUrl:'',workdayHours:8}.

## Model API
All mutations mutate passed state synchronously, return created/updated object, validate before changing state, throw Error with useful Arabic message. Root persists only on successful mutation.
- seed(now), uid(prefix), can(state,userId,permission,branchId), visibleOrders(state,userId,branchId='all').
- createOrder(state,userId,payload), updateOrder(state,userId,orderId,patch).
- transitionOrder(state,userId,orderId,nextStatus): allowed stages; approval gates; final ready requires qualityPassed. Delivered freezes normal editing. cancelled releases reservations.
- assignTeam(state,userId,orderId,team): team nonempty, active staff in branch, unique IDs, shares sum100, minutes>=0.
- acceptAssignment(state,userId,orderId): employee accepts own production assignment, stamps acceptedAt once, repeated acceptance is idempotent.
- completeAssignment(state,userId,orderId,minutes): requires acceptedAt; actor completes own assignment once, changes only own credit.
- reserveRemnant(state,userId,remnantId,orderId): same branch/material/dimensions fit (rotation accepted), one reservation, no reuse/double assignment; releaseRemnant(state,userId,remnantId).
- consumeMaterial(state,userId,orderId,{materialId,quantity,wasteQuantity,note}): quantity total issued, wasteQuantity subset, no negative stock or doublecost; add order consumption and actualCost, retain audit.
- createPurchase(state,userId,payload), approvePurchase(state,userId,id), rejectPurchase(state,userId,id), receivePurchase(state,userId,id): receive once increments material.quantity and weighted-average unitCost; correct branch.
- submitReview(state,{token,rating,name,comment}): token tied to one existing delivered order, 1..5 integer, text limits, one review/token (or idempotent same record), no login needed.
- employeePerformance(state,employeeId,monthYYYYMM): {completed,contribution,onTimeRate,avgRating,minutes,score,level,target,assigned}; no-data => score:null, level:'لا توجد بيانات كافية'; shared credits do not duplicate 100%.
- totals(state,userId,branchId='all',from='',to=''): {orders,sales,cost,margin,active,late,ready,delivered}; financial sums only delivered orders with dates in range. cost direct actualCost or estimatedCost clearly label basis.
- validateState(candidate): throws on malformed backup; return validated state.
Permission names: view_all_branches,view_financials,manage_orders,approve_design,manage_production,manage_inventory,request_purchase,approve_purchase,receive_purchase,manage_team,manage_branches,view_reports,view_reviews,manage_settings.

## Calculator API
Methods pure, throw readable Arabic errors, reject NaN, negative, absurd input, noninteger quantity. Round money outputs at end.
- sheet({sheetW,sheetH,pieceW,pieceH,quantity,gap,margin,bleed=0,allowRotate=true,sheetCost=0,cutCost=0,setupCost=0,laborCost=0,markup=35}): cm units. Return {columns,rows,perSheet,sheets,rotated,usedArea,totalArea,wasteArea,wastePercent,totalCost,unitCost,suggestedPrice,unitSuggestedPrice,layout:{sheetW,sheetH,pieceW,pieceH,columns,rows,gap,margin,bleed,rotated},breakdown:[{label,value}],notes:[]}.
- roll({rollWidth,length,width,quantity,inkMlPerM2,inkCostPerMl,mediaCostPerM2,wastePercent,finishingPerM2,setupCost,laborCost,markup}): meters dimensions; {area,consumedArea,linearMeters,inkMl,totalCost,unitCost,suggestedPrice,unitSuggestedPrice,breakdown,notes}. Reject width>rollWidth unless rotated fits; no silent tiling.
- letters({height,count,rate,minHeight=1,logo=false,logoMultiplier=2,roundUp=false,cost=0,markup=35}): meters; {billableHeight,billableMeters,totalCost,suggestedPrice,rule,breakdown,notes} count positive integer; quote based supplied rate, not markup rule, if rate0 fallback cost markup.
- led({mode:'module'|'strip',width,height,spacingX,spacingY,edge,wattsPerUnit,manualCount,stripLength,wattsPerMeter,rollLength,voltage,powerSupplyWatts,loadPercent=80,maxPerChain,unitPrice,powerSupplyPrice,markup}): module dims cm; manualCount optional else centered rectangular grid, validate matchingvoltage all implicitlysame; {count,rows,columns,stripLength,rolls,totalWatts,currentAmps,usableWatts,powerSupplies,chains,distribution:[{supply,units,watts,loadPercent}],totalCost,suggestedPrice,notes,layout}. Never parallel outputs; do not call schematic electrical approval.
- general({quantity,materialCost,printCost,laborMinutes,hourlyRate,machineCost,finishingCost,packagingCost,overhead,markup}): {totalCost,unitCost,suggestedPrice,unitSuggestedPrice,profit,marginPercent,breakdown,notes} costs batch totals, laborMinutes total.

## Catalog API
`categories`: [{id,name,icon,color,description,services:[{name,unit,calculator,stages:[],basePrice}]}] categories paper,banners,stickers,acrylic,letters,stamps,gifts,projects,models,flags,packaging,installation. calculators sheet|roll|letters|led|general. Demo prices marked examples.
`stages` array {id,label,color}; `permissions` array {id,label}; `icons` object name=>SVG innerMarkup with no outer svg, 24x24 stroke=currentColor.
`WOQR.svg(text, options={size:240,margin:4})` returns correct QR SVG with 4-module quiet zone; accept ASCII URL; self-contained QR encoder permissive license with attribution. `WOQR.matrix(text)` optional for tests.
