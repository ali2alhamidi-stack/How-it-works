# أوامر — مشاريع Windows وAndroid

المجلد يحوي تطبيق Windows ببرنامج C# .NET 8 WPF وWebView2، وتطبيق Android أصليا بلغة Java يستخدم Android WebView. شكل الواجهة يأتي من النظام المركزي نفسه؛ هذا تغليف تطبيقي آمن للواجهة وليس إعادة بناء جميع الأقسام بواجهات Native.

لتجهيز الملفات، افتح GitHub Actions ثم Build Windows EXE and Android APK. ملفات Artifacts بعد نجاح البناء:
- Awamer-Windows-EXE-x64: ملف مضغوط يحتوي Awamer.exe وملفاته اللازمة. يحتاج Windows مع WebView2 Runtime.
- Awamer-Android-TEST-APK: نسخة Android موقعة بمفتاح debug للاختبار فقط.

لإصدار APK تجاري وقع التطبيق عبر GitHub Secrets: AWAMER_ANDROID_KEYSTORE_BASE64, AWAMER_ANDROID_KEYSTORE_PASSWORD, AWAMER_ANDROID_KEY_ALIAS, AWAMER_ANDROID_KEY_PASSWORD. الملف Release لا يبنى إذا كانت الأسرار ناقصة، ويجب حفظ المفتاح خارج GitHub احتياطيا. لا تشارك كلمات المرور أو مفاتيح الإنتاج في المحادثة.

ملف Windows الحالي EXE بدون توقيع Authenticode، وقد يظهر تحذير SmartScreen. اختبار أجهزة Windows وAndroid إلزامي قبل التوزيع التجاري، وخصوصا الكاميرا والمرفقات والطباعة، وتزامن المسودات بعد انقطاع الشبكة.

العنوان المثبت في كلا التطبيقين: https://awamer-app-production.up.railway.app/ . إذا تغير عنوان الخادم يجب تحديث المصدر وإصدار ملف جديد. أول تسجيل دخول يحتاج الإنترنت؛ التخزين المؤقت اللاحق يعتمد على PWA الموجودة في التطبيق.
