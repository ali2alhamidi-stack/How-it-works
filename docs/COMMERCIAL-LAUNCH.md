# أوامر — التشغيل والتطبيقات والاشتراكات

التاريخ: 15 نوفمبر 2026

## الخادم

نشر Railway الفعلي: https://awamer-app-production.up.railway.app/

الخدمة awamer-app ضمن مشروع Awamer Work Orders، بنسخة واحدة وقرص SQLite دائم /data سعة 400 MB. نتائج المراقبة بتاريخ 15 نوفمبر أظهرت نشر SUCCESS وحالة Online. تنشأ لقطات احتياطية متحققا منها على نفس القرص. النسخ خارج الاستضافة مع تشفير واختبار استعادة ما زال مطلوبا، ولا يعتبر النسخ على القرص نفسه خطة تعاف كاملة.

لوحة الإدارة المحمية بحساب مالك المنصة: https://awamer-app-production.up.railway.app/commercial.html

## تطبيق Windows وAndroid

يحتوي المستودع على native/windows (C# .NET 8 WPF / WebView2) وnative/android (Java / Android WebView). كلاهما تطبيق قابل لإصدار EXE وAPK يستخدم الواجهة المركزية نفسها، وليس إعادة كتابة جميع شاشات النظام باستخدام واجهات أصلية. لا توجد قواعد بيانات عملاء منفصلة عن خادم الإنتاج. يعتمد العمل المحدود دون اتصال على التخزين المحلي الموجود في PWA، وأول تسجيل دخول يحتاج الإنترنت.

تُنتج GitHub Actions نسختين تجريبيتين بعد نجاح Build Windows EXE and Android APK. ملف Windows يحتاج Microsoft Edge WebView2 Runtime، وقد يظهر تحذير SmartScreen إلى أن يوقع Authenticode. ملف Android التجريبي موقع بمفتاح debug وغير صالح للنشر التجاري.

لإصدار APK موقع بإمضاء المنشأة ضبط GitHub Secrets:
- AWAMER_ANDROID_KEYSTORE_BASE64
- AWAMER_ANDROID_KEYSTORE_PASSWORD
- AWAMER_ANDROID_KEY_ALIAS
- AWAMER_ANDROID_KEY_PASSWORD

احتفظ بالمفتاح في خزانة أسرار آمنة وبنسخة استعادة، ولا تضعه في Git. اختبار الجهاز الفعلي مطلوب: الكاميرا والمرفقات، الطباعة، الواجهة RTL، مسودات دون إنترنت، تعدد الفروع والمزامنة.

## دفع الاشتراكات عبر Moyasar

صفحة /commercial.html تنشئ رابط فاتورة دفع SAR لدى Moyasar باستخدام واجهة الخادم. لا تُحفظ بيانات البطاقة عند أوامر. يستجيب النظام للتأكيد من رابط webhook خاص بكل فاتورة محمي بتوقيع HMAC، ثم يجلب حالة الفاتورة من Moyasar بمفتاح الخادم السري. تمديد الاشتراك يحدث فقط إذا كانت حالة الفاتورة paid، والمعرف والمبلغ والعملة مطابقين، ومرة واحدة فقط.

متغيرات Railway المطلوبة:
- MOYASAR_SECRET_KEY: مفتاح sk_test_ للاختبارات أو sk_live_ للتشغيل الحقيقي
- MOYASAR_WEBHOOK_SECRET: سلسلة عشوائية لا تقل عن 24 حرفا
- APP_ORIGIN=https://awamer-app-production.up.railway.app

إذا فشل إصدار الفاتورة مع احتمال قبول المزود للطلب تبقى للمراجعة، ولا تعاد العملية آليا حتى لا تنشأ فاتورتان. يلزم حساب تاجر مؤهل في Moyasar، وموافقة المزود وإعداد التسوية البنكية. لا يبدأ أي تحصيل حقيقي قبل ذلك.

## واتساب الآلي

المتغيرات المطلوبة على Railway:
- WHATSAPP_ENABLE_SENDING=true
- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_GRAPH_VERSION (إصدار Graph المدعوم في حسابك)
- WHATSAPP_EXPIRY_TEMPLATE (اسم قالب Utility معتمد في Meta)
- WHATSAPP_LANGUAGE=ar
- WHATSAPP_APP_SECRET
- WHATSAPP_VERIFY_TOKEN

Webhook Meta: https://awamer-app-production.up.railway.app/api/webhooks/whatsapp

يتحقق النظام من طلب GET بواسطة hub.verify_token، ويعتمد توقيع x-hub-signature-256 في POST لتحديث حالات التسليم. تنشئ لوحة الإدارة جهة اتصال بعد تأكيد موافقة صاحب الرقم وتسجيل وقتها. يرسل تنبيها واحدا عند اقتراب نهاية الاشتراك خلال سبعة أيام، بمتغيري القالب اسم المنشأة وتاريخ الانتهاء. تتكرر مهمة الفحص كل ساعة عند تفعيل الإرسال وتوفر مفاتيح Meta جميعها.

عند إلغاء الموافقة يتوقف إنشاء الرسائل ويلغى الطابور غير المرسل. عند فشل غامض بعد بدء الإرسال تحفظ الحالة needs_review دون تكرار تلقائي محتمل. استجابة قبول الرسالة لا تثبت التسليم حتى وصول تحديث من Meta.

## التحقق والقيود

نفذ node --test tests/*.test.cjs ثم python3 build.py ثم node scripts/verify-build.cjs. صلاحية الواجهات الإدارية محصورة بمالك المنصة مع CSRF، والرموز السرية لا تُخزن في المستودع. غياب بيانات Moyasar أو Meta يعني أن الدمج البرمجي موجود لكن الدفع والإرسال الفعليين غير مفعلين. لا تعتمد العمل تجاريا حتى التوقيع والاختبارات الميدانية والتفعيل الرسمي للبوابات.
