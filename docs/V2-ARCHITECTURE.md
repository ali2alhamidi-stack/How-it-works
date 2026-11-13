# نظام أوامر العمل والتشغيل — النسخة المركزية 2

## القرار التنفيذي

تطوير النسخة السابقة، مع واجهة واحدة للمنشأة ومدير الفرع والموظفين والمشتريات. تثبيت PWA على Windows وAndroid من المتصفح؛ هذه ليست حزمة Native/APK. لوحة منصة مستقلة لإنشاء المنشآت وحساب المالك وحدود الفروع والمستخدمين وتعليق الاشتراك. نفس المستودع، عزل بيانات كل منشأة على الخادم، وصلاحيات الفرع داخلها. واجهة عربية RTL دون محاسبة أو ضريبة.

Node.js 24 + SQLite المدمجة + JavaScript/CSS، دون اعتماد تشغيل على npm packages. خادم HTTP واحد يقدم API والواجهة. إعادة استخدام model.js/calculators.js/qr.js واختباراتها. طبقة SQLite هي الحكم النهائي؛ واجهة العرض المحلي منفصلة وواضحة عن الدخول المركزي.

## التسليم

- تطبيق مركزي، لوحة مالك منصة، دخول حقيقي وكلمات مرور مشتقة ببطء وجلسات HttpOnly.
- تطوير تصميم الأقسام إلى واجهة أنظف، مع بقاء الأيقونات الملونة وإتاحة المظهرين.
- خامات موسعة، تحويل عبوات شراء، حجز وصرف وجرد وتحويل وفحص الرصيد، وربطها بالحاسبات.
- حاسبات وكتالوج أصناف قابل للإضافة والتعديل، وبواقي وصرف ومشتريات متكاملة.
- PWA وذاكرة محلية ومسودات؛ العمليات المؤجلة لا تسمى متزامنة قبل تأكيد الخادم. التعارض يحفظ طلب المستخدم ويعرضه للمراجعة ولا يستبدل بيانات الخادم.
- المصدر والاختبارات وأوامر التشغيل والنشر ونسخة العرض. وجهة التسليم المعتمدة: GitHub في المستودع ali2alhamidi-stack/How-it-works بعد اكتمال التحقق المحلي. تشغيل الاستضافة خطوة منفصلة تحتاج خادما مناسبا.

## ملكية الملفات في التنفيذ

- backend: server/**, scripts/create-owner.cjs, scripts/dev.cjs, tests/server*.test.cjs.
- inventory: src/inventory-engine.js, src/material-catalog.js, tests/inventory*.test.cjs, docs/MATERIALS.md.
- visual: src/premium.css, src/platform-ui.js, assets/app-mark.svg, tests/platform*.test.cjs عند الحاجة.
- root: src/app.js, src/transport.js, src/inventory-ui.js, build.py, public output, PWA, integration tests, docs, packaging, GitHub.

## خادم وواجهة — عقد موحد

`createApplication({dbPath,publicDir,origin,secureCookies,sessionHours,bootstrapOwner})` من server/app.cjs يعيد `{handler,close,store}`؛ `server/main.cjs` يشغل HTTP على HOST/PORT. اختبارات HTTP تستخدم server.listen(0,'127.0.0.1'). لا أسرار أو بيانات دخول إنتاجية في المصدر.

### الحساب والجلسة

- POST `/api/login` `{email,password}` -> `{account,csrfToken}` + session cookie؛ رفض التخمين المتكرر، نفس رسائل الخطأ، JSON فقط وOrigin موثوق.
- GET `/api/session` -> `{account,csrfToken}` أو401.
- POST `/api/logout` مع X-CSRF-Token؛ إلغاء الجلسة ومسحCookie.
- account `{id,email,name,kind:'platform'|'tenant',tenantId?,userId?,role?}`.
- POST `/api/password` `{currentPassword,newPassword}`؛ إلغاء الجلسات الأخرى.

### لوحة المنصة (platform فقط)

- GET `/api/platform/tenants` -> `{tenants,stats}`.
- POST `/api/platform/tenants` `{name,slug,ownerName,ownerEmail,password,maxUsers,maxBranches,expiresAt,currency}` -> `{tenant,account}`؛ إنشاء فرع أول ومالك وبيانات أعمال فارغة في معاملة واحدة.
- PATCH `/api/platform/tenants/:id` `{name,status:'active'|'suspended',maxUsers,maxBranches,expiresAt}`؛ تحقق من الحدود والتواريخ، وقف وصول الجلسات فور التعليق.
- POST `/api/platform/tenants/:id/reset-owner` `{password}`؛ اشتقاق آمن وإلغاء الجلسات.
- GET `/api/platform/audit` -> `{events}` دون أسرار.
- tenants include `{id,name,slug,status,maxUsers,maxBranches,expiresAt,createdAt,userCount,branchCount,orderCount,ownerEmail}`.

### تطبيق المنشأة

- GET `/api/state` -> `{state,revision,account,tenant}`. ترشيح البيانات على الخادم حسب الفرع والمهام؛ الأسعار والتكاليف صفر/محذوفة لغير المخولين، لا تسريب عبر المجاميع أو audit. لا يرجع الخادم كلمات المرور أو الجلسات.
- POST `/api/commands` `{requestId,baseRevision,actions:[{type,payload}]}` -> `{state,revision,results}`. معاملة SQLite واحدة، تحقق صلاحيات كل action من حساب الجلسة وليس actor المرسل، رقم مراجعة متفائل، idempotency حسب tenant/account/requestId؛ تكرار نفس الطلب يعيد النتيجة، reuse بمحتوى مختلف409.
- خطأ `{error:{code,message,details?}}` HTTP400/401/403/404/409/413/429. REVISION_CONFLICT يعرض currentRevision ولا يكتب شيئا.
- GET `/api/backup` owner + manage_settings فقط -> نسخة بيانات منشأته.
- POST `/api/users` `{user:{name,role,branchIds,jobTitle,targetMonthly},email,password}` -> state/revision؛ إنشاء مستخدم domain وحساب credentials في معاملة. online-only.
- PATCH `/api/users/:userId` `{name,role,branchIds,jobTitle,targetMonthly,active}`؛ صلاحية الفرع الحالي والمقترح، حماية المالك وآخرمالك، منع تغيير دور/فرع موظف مرتبط بأعمال بما يكسر التاريخ.
- POST `/api/users/:userId/password` `{password}`؛ مدير مخول ضمن الفرع/مالك فقط، إلغاء جلسات الهدف.

### الأوامر المعروفة

أسماء `type` التالية ثابتة؛ payload من دون actorId، entityId معرف السجل:

| type | payload |
|---|---|
| order.create | `{data,clientId}`؛ clientId هنا معرف order مولد محليا، data.clientId هو العميل التجاري. يتحقق الخادم من معرف فريد وآمن. يعيد الخادم ترقيمه الحقيقي |
| order.update | `{id,patch}` |
| order.team | `{id,team}` |
| order.transition | `{id,status}` |
| task.accept | `{id}` |
| task.complete | `{id,minutes}` |
| order.note | `{id,text}` |
| order.photo | `{id,attachment:{name,dataUrl}}` |
| material.consume | `{orderId,data}` يستخدم WOInventory.issue إن وجدت |
| remnant.reserve | `{id,orderId}` |
| remnant.release | `{id}` |
| purchase.create | `{data,clientId}` |
| purchase.approve / purchase.reject / purchase.receive | `{id}`؛ receive يستخدم WOInventory.receivePurchase |
| client.create | `{data}` |
| client.update | `{id,patch}` |
| branch.create | `{data}` مع فحص حد الفروع |
| branch.update | `{id,patch}` |
| material.create | `{data}` |
| material.update | `{id,patch}` |
| material.adjust | `{id,quantity,reason}` |
| material.reserve | `{id,orderId,quantity}` |
| material.release | `{reservationId}` |
| material.transfer | `{id,toBranchId,quantity,reason}` |
| remnant.create | `{data}` |
| brand.update | `{patch}` |
| pricing.update | `{pricing}` |
| service-prices.update | `{prices}` |
| performance.update | `{weights}` |
| connections.update | `{publicBaseUrl,apiBaseUrl}` إعداد فقط، لا اتصالات اعتباطية من الخادم |
| user.permissions | `{id,permissions}` owner/manage_settings فقط |

يحافظ create على المعرف المحلي المقدم الآمن لتعمل الأوامر التابعة في نفس الدفعة؛ الخادم لا يثق بالأرقام أو الحقول المحسوبة المرسلة.

### صفحة العميل العامة

- GET `/api/public/reviews/:token` -> `{brand,order:{number,title,deliveredAt},reviewed}` فقط، لا أسماء موظفين أو أسعار أو بيانات دخول.
- POST نفس المسار `{rating,name?,comment?}`؛ token طويل عشوائي مرتبط بأمر مسلّم، مرة واحدة، حدود طول ومعدل. يصل التقييم فعليا لبيانات الإدارة.
- حسابات مركزية ومعلومات عامة لا تُخزن في service worker cache؛ cache لملفات التطبيق فقط.

## ربط الواجهة

`WOTransport` يوفر `init()`, `login(email,password)`, `logout()`, `getSession()`, `getSnapshot()`, `subscribe(fn)`, `commit(actions,optimisticState)`, `refresh()`, `request(path,method,body)`, `queueInfo()`, `exportPending()`, `discardPending()`.

init returns `{mode:'connected'|'demo',account,state,revision,tenant,offline}`؛ بدونجلسة connected يرجع account:null ولا يفتح بيانات العرض تلقائيا.

root يلتقط دوال WOModel التي تستخدمها mutate في قائمة actions. التعديلات المباشرة تستند لأحداث audit المحددة وتتحول إلى أنواع معروفة. API لا يقبل state كاملا بدلا من أوامر. عند فشل تحقق الخادم ترجع الواجهة آخر حالة مؤكدة، وتحتفظ بالطلب في سجل المراجعة. العمليات التي تحمل كلمات مرور online-only ولا تدخل outbox.

`WOPlatform.mount({root,api,account,onLogout})`: يبني لوحة مستقلة في عنصر #app، api(path,method,body) من WOTransport، ويستخدم عقد المنصة أعلاه. لا بيانات تجريبية في لوحة المنصة المركزية.

## عقد إدارة الخامات

`WOInventory` UMD CommonJS/browser، يعتمد على WOModel. الدوال mutate(state,userId,...), throw Error عربية؛ لا IO:

- `createMaterial(state,userId,data)`، `updateMaterial(state,userId,id,patch)`.
- `adjust(state,userId,id,quantity,reason)` الجرد النهائي لاينزل دون المحجوز.
- `availability(state,materialId,orderId?)` -> `{onHand,reserved,available,allocatedToOrder}`.
- `convert(material,quantity,unit)` -> base quantity؛ baseUnit من sheet|m|m2|piece|ml|kg، purchaseUnits `[ {name,factor} ]` خاصة بالصنف، count units integer.
- `reserve(state,userId,materialId,orderId,quantity)` -> reservation؛ `release(state,userId,reservationId)`.
- `issue(state,userId,orderId,{materialId,quantity,wasteQuantity,note})`؛ الهدر جزء من الإجمالي. يسحب حجز الأمر ويمنع استهلاك حجز غيره، يستدعي Model.consumeMaterial لحساب التكلفة والسجل.
- `receivePurchase(state,userId,purchaseId)`؛ Model.receivePurchase مرة واحدة + سجل lot/movement اختياري، لا double count.
- `transfer(state,userId,materialId,toBranchId,quantity,reason)`؛ صلاحية الفرعين، منع حجز غيرمحرر، تحديث ذرّي وتحويل التكلفة.
- `suggest(state,request)` -> مواد/بواقي مناسبة دون حجز؛ `calculatorPreset(material,type)` -> حقول الحاسبة الملائمة.
- `validateExtensions(state)` يفحص البيانات الموسعة بعد validateState الأساسي.

Material extends fields: `sku,barcode,baseUnit,purchaseUnits,form,width,height,thickness,gsm,finish,color,location,supplier,sourceUrl,specStatus,inkMlPerM2,compatibleProcess`. width/height cm; roll.width cm, quantity m عند baseUnit=m. قالب جديد يبدأ quantity0/unitCost0 مع costConfirmed:false ولا يدعي توفر مخزون.

Extensions `stockReservations`, `stockMovements` لا تحذف تاريخيا. Raw material reservation released on cancelled order and consumed/released appropriately at issue/delivery; backend enforces. لا تتحول مساحة حاسبة غيرمستغلة تلقائيا إلى بواقي مؤكدة.

## اختبارات الإغلاق

1. حسابات منشأتين ومنع القراءة/الكتابة عبرهما بما في ذلك معرفات قادمة من العميل.
2. موظف لا تصله الأسعار في API ولا يستطيع ترقيات صلاحيات أو تغيير حصته أو مرحلة المدير.
3. معاملات/idempotency/مراجعة متفائلة دون مضاعفة الصرف/الاستلام، والذرية إذا أخفقت عملية داخلدفعة.
4. حدود المستخدمين والفروع وتعليق المنشأة وإبطال الجلسات.
5. رصيدمحجوز/تحويلعبوة/جرد/تحويلمخزون/الهدر وانتهاء دورةأمر وتأثيرالمخزون.
6. اتصال فعلي بالواجهة، حفظ المسودات، نفاذ جلسة، انقطاعالطلب وإعادةالمحاولة، وتقييم عام يصل للإدارة.
7. CSS كمبيوتر وجوال، مسارات لوحةمالكالمنصة، وتوليد PWA صالح. لا ادعاء نجاح جهاز فعلي دون اختباره.
