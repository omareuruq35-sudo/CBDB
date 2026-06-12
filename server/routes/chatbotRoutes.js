const EmergencyAd = require("../models/EmergencyAd");
const Fuse = require("fuse.js");
const express = require("express");

const router = express.Router();

/* =========================
   1) Blood Banks Data
========================= */

const bloodBanks = {
  "الإسكندرية": {
    aliases: ["اسكندرية", "الاسكندرية", "الاسكندريه", "اسكندريه", "alex", "alexandria"],
    address: "154 شارع السوق (باكوس)",
    phones: ["0123456789", "0123456789"]
  },
  "الإسماعيلية": {
    aliases: ["اسماعيلية", "الاسماعيلية", "اسماعيليه", "الاسماعيليه", "اسماعلية", "الاسماعلية", "ismailia", "ismaillia"],
    address: "ميدان المطافي",
    phones: ["0123456789", "0123456789"]
  },
  "القاهرة": {
    aliases: ["قاهرة", "القاهره", "قاهره", "cairo"],
    address: "فاقوس - محطة العزازي",
    phones: ["0123456789", "0123456789"]
  },
  "المنوفية": {
    aliases: ["المنوفيه", "منوفية", "منوفيه", "شبين الكوم", "menoufia", "monufia"],
    address: "شبين الكوم - شارع جمال عبد الناصر",
    phones: ["0123456789", "0123456789"]
  },
  "الغربية": {
    aliases: ["الغربيه", "غربية", "غربيه", "طنطا", "فربيه", "gharbia", "tanta"],
    address: "المجمع الطبي (شارع البحر)",
    phones: ["0123456789", "0123456789"]
  }
};

const governoratesMap = {
  "الإسكندرية": {
    aliases: ["اسكندرية", "الاسكندرية", "الاسكندريه", "اسكندريه", "alex", "alexandria"],
    nearest: ["الإسكندرية"]
  },
  "الإسماعيلية": {
    aliases: ["اسماعيلية", "الاسماعيلية", "اسماعيليه", "الاسماعيليه", "ismailia"],
    nearest: ["الإسماعيلية"]
  },
  "القاهرة": {
    aliases: ["قاهرة", "القاهره", "قاهره", "cairo"],
    nearest: ["القاهرة"]
  },
  "المنوفية": {
    aliases: ["المنوفيه", "منوفية", "منوفيه", "شبين الكوم", "menoufia"],
    nearest: ["المنوفية", "الغربية", "القاهرة"]
  },
  "الغربية": {
    aliases: ["الغربيه", "غربية", "غربيه", "طنطا", "gharbia", "tanta"],
    nearest: ["الغربية", "المنوفية", "الإسكندرية"]
  },
  "الشرقية": {
    aliases: ["الشرقيه", "شرقية", "شرقيه", "الزقازيق", "زقازيق", "sharkia", "zagazig"],
    nearest: ["الإسماعيلية", "القاهرة", "الغربية"]
  },
  "الدقهلية": {
    aliases: ["الدقهليه", "دقهلية", "دقهليه", "المنصورة", "المنصوره", "منصورة", "منصوره", "dakahlia", "mansoura"],
    nearest: ["الغربية", "المنوفية", "الإسماعيلية"]
  },
  "القليوبية": {
    aliases: ["القليوبيه", "قليوبية", "قليوبيه", "بنها", "banha", "qaliubiya"],
    nearest: ["القاهرة", "المنوفية", "الغربية"]
  },
  "الجيزة": {
    aliases: ["الجيزه", "جيزة", "جيزه", "giza"],
    nearest: ["القاهرة"]
  },
  "البحيرة": {
    aliases: ["البحيره", "بحيرة", "بحيره", "دمنهور", "beheira", "damanhur"],
    nearest: ["الإسكندرية", "الغربية"]
  },
  "كفر الشيخ": {
    aliases: ["كفرالشيخ", "kafr el sheikh", "kafr elsheikh"],
    nearest: ["الغربية", "الإسكندرية"]
  },
  "دمياط": {
    aliases: ["damietta"],
    nearest: ["الإسماعيلية", "الغربية"]
  },
  "بورسعيد": {
    aliases: ["بور سعيد", "port said", "portsaid"],
    nearest: ["الإسماعيلية"]
  },
  "السويس": {
    aliases: ["سويس", "suez"],
    nearest: ["الإسماعيلية", "القاهرة"]
  },
  "بني سويف": {
    aliases: ["بنى سويف", "bani suef", "beni suef"],
    nearest: ["القاهرة"]
  },
  "الفيوم": {
    aliases: ["فيوم", "fayoum"],
    nearest: ["القاهرة"]
  },
  "المنيا": {
    aliases: ["منيا", "minya"],
    nearest: ["القاهرة"]
  },
  "أسيوط": {
    aliases: ["اسيوط", "asyut", "assiut"],
    nearest: ["القاهرة"]
  },
  "سوهاج": {
    aliases: ["sohag"],
    nearest: ["القاهرة"]
  },
  "قنا": {
    aliases: ["qena"],
    nearest: ["القاهرة"]
  },
  "الأقصر": {
    aliases: ["الاقصر", "luxor"],
    nearest: ["القاهرة"]
  },
  "أسوان": {
    aliases: ["اسوان", "aswan"],
    nearest: ["القاهرة"]
  },
  "مطروح": {
    aliases: ["مرسى مطروح", "مرسي مطروح", "matrouh", "marsa matrouh"],
    nearest: ["الإسكندرية"]
  },
  "البحر الأحمر": {
    aliases: ["البحر الاحمر", "الغردقة", "غردقه", "hurghada", "red sea"],
    nearest: ["الإسماعيلية", "القاهرة"]
  },
  "الوادي الجديد": {
    aliases: ["وادى جديد", "new valley"],
    nearest: ["القاهرة"]
  },
  "شمال سيناء": {
    aliases: ["شمال سينا", "العريش", "north sinai", "arish"],
    nearest: ["الإسماعيلية"]
  },
  "جنوب سيناء": {
    aliases: ["جنوب سينا", "شرم الشيخ", "sharm", "south sinai"],
    nearest: ["الإسماعيلية"]
  }
};

const userState = {};

/* =========================
   2) FAQ / Intents
========================= */

const faq = [
  {
    intent: "eligibility",
    questions: [
      "شروط",
      "الشروط",
      "شروط التبرع",
      "شروط التبرع بالدم",
      "شروط المتبرع",
      "ايه شروط التبرع",
      "ما هي شروط التبرع",
      "مين يقدر يتبرع",
      "مين ينفع يتبرع",
      "هل اي حد يقدر يتبرع",
      "المتطلبات للتبرع",
      "متطلبات التبرع",
      "المعايير للتبرع",
      "السن المطلوب للتبرع",
      "وزن التبرع",
      "لازم ابقى عندي كام سنة",
      "لازم وزني يبقى كام",
      "هل السن مهم في التبرع",
      "متى يسمح بالتبرع"
    ],
    answer: `🩸 شروط التبرع بالدم

• العمر غالبًا من 18 إلى 60 سنة.
• الوزن لا يقل عن 50 كجم.
• تكون الحالة الصحية مستقرة.
• لا يوجد أنيميا شديدة أو عدوى نشطة.
• يكون الضغط والهيموجلوبين مناسبين وقت الكشف.
• يتم عمل كشف بسيط قبل التبرع.

📌 القرار النهائي بيكون حسب الطبيب أو بنك الدم.`
  },

  {
    intent: "rejection",
    questions: [
      "موانع",
      "الموانع",
      "موانع التبرع",
      "موانع التبرع بالدم",
      "حالات تمنع التبرع",
      "مين مينفعش يتبرع",
      "مين لا يتبرع",
      "امتى مينفعش اتبرع",
      "امتى التبرع يتأجل",
      "ايه اسباب رفض التبرع",
      "ليه ممكن اترفض في التبرع",
      "هل المرض يمنع التبرع",
      "حاجات تمنع التبرع",
      "اي اللي ممكن يمنعني من التبرع "
    ],
    answer: `⚠️ موانع التبرع بالدم

ممكن يتأجل أو يترفض التبرع في حالات زي:

• أنيميا أو هيموجلوبين منخفض.
• عدوى أو سخونية أو التهاب نشط.
• حمل أو رضاعة حسب الحالة.
• وزن أقل من 50 كجم.
• ضغط أو سكر غير مستقر.
• بعض الأدوية أو العمليات الحديثة.
• تاتو أو بيرسينج حديث.

📌 الأفضل تسألي الطبيب أو بنك الدم لو عندك حالة صحية.`
  },

  {
    intent: "locations",
    questions: [
      "اماكن",
      "الأماكن",
      "مكان",
      "عنوان",
      "عناوين",
      "رقم",
      "ارقام",
      "تليفون",
      "اماكن بنوك الدم",
      "فين بنوك الدم",
      "فين بنك الدم",
      "اقرب بنك دم",
      "اماكن التبرع بالدم",
      "مراكز التبرع",
      "مكان اتبرع فيه",
      "فين اقدر اتبرع بالدم",
      "فين ممكن اتبرع",
      "عناوين بنوك الدم",
      "ارقام بنوك الدم",
      "فين اقرب مكان للتبرع"
    ],
    answer: buildAllBloodBanksReply()
  },

  {
    intent: "frequency",
    questions: [
      "كل قد ايه",
      "كل كام",
      "كل كام شهر",
      "عدد مرات التبرع",
      "معدل التبرع",
      "امتى اقدر اتبرع تاني",
      "امتى اتبرع تاني",
      "الفترة بين كل تبرع والتاني",
      "الفاصل بين التبرعات",
      "كام مرة اقدر اتبرع في السنة",
      "هل ينفع اتبرع كل شهر",
      "هل لازم استنى 3 شهور",
      "اقصى عدد مرات التبرع"
    ],
    answer: `🔁 عدد مرات التبرع

• الرجال: غالبًا كل 3 شهور.
• النساء: غالبًا كل 4 إلى 6 شهور حسب الحالة.
• لازم الجسم ياخد وقت يعوض الدم.

📌 لو عندك تعب أو أنيميا، الأفضل تأجلي التبرع وتسألي الطبيب.`
  },

  {
    intent: "duration",
    questions: [
      "مدة التبرع",
      "وقت التبرع",
      "التبرع بياخد وقت قد ايه",
      "التبرع بياخد كام دقيقة",
      "كم دقيقة التبرع بالدم",
      "العملية بتاخد وقت قد ايه",
      "التبرع بالدم بيستغرق قد ايه",
      "هقعد قد ايه في التبرع",
      "مدة سحب الدم",
      "هل التبرع بياخد وقت طويل",
      "من اول ما ادخل لحد ما اخلص بياخد قد ايه"
    ],
    answer: `⏱️ مدة التبرع

• سحب الدم نفسه بياخد تقريبًا 10 دقايق.
• كل الإجراءات مع التسجيل والكشف ممكن توصل لحوالي 30 دقيقة.

📌 الوقت ممكن يختلف حسب الزحمة وإجراءات بنك الدم.`
  },

  {
    intent: "before_after_donation",
    questions: [
      "قبل التبرع",
      "بعد التبرع",
      "قبل وبعد التبرع",
      "ارشادات التبرع",
      "إرشادات التبرع",
      "نصايح التبرع",
      "اعمل ايه قبل التبرع",
      "اعمل اي بعد التبرع",
      "قبل التبرع اعمل ايه",
      "بعد التبرع اعمل ايه",
      "ارشادات قبل التبرع",
      "ارشادات بعد التبرع",
      "نصايح قبل التبرع",
      "نصايح بعد التبرع",
      "تحضير قبل التبرع",
      "ازاي اجهز نفسي للتبرع",
      "هل لازم اكل قبل التبرع",
      "اشرب ايه قبل التبرع",
      "هل ارتاح بعد التبرع",
      "قبل ما اتبرع اعمل ايه",
      "بعد ما اتبرع اعمل ايه"
    ],
    answer: [
      "نامي كويس قبل التبرع.",
      "كلي وجبة خفيفة قبل التبرع وابعدي عن الأكل الدسم.",
      "اشربي مياه كويس قبل وبعد التبرع.",
      "بلاش تدخين قبل وبعد التبرع بساعتين.",
      "البسي هدوم مريحة.",
      "قولي للطبيب على أي أدوية أو مشاكل صحية.",
      "ارتاحي 10 إلى 15 دقيقة بعد التبرع.",
      "تجنبي المجهود الشديد لمدة 24 ساعة.",
      "لو حصل دوخة، اقعدي وارفعي رجلك."
    ]
  },

  {
    intent: "benefits",
    questions: [
      "فوائد",
      "فوايد",
      "فايدة",
      "اهمية",
      "أهمية",
      "فوائد التبرع",
      "فوايد التبرع",
      "فوائد التبرع بالدم",
      "هل التبرع مفيد",
      "ليه اتبرع",
      "لماذا اتبرع",
      "فايدة التبرع ايه",
      "ايه فوايد التبرع",
      "هل التبرع بيجدد الدم",
      "هل التبرع ينشط الجسم",
      "ايه مميزات التبرع بالدم",
      "هل التبرع له فوائد صحية",
      "ايه اهمية التبرع بالدم"
    ],
    answer: [
      "يساعد في إنقاذ حياة المرضى.",
      "يدعم مخزون الدم للحالات الطارئة.",
      "يساعد الجسم على تجديد خلايا الدم.",
      "قبل التبرع بيتم عمل فحص بسيط للمتبرع.",
      "التبرع المنتظم قد يكون مفيدًا للصحة العامة عند الشخص المناسب."
    ]
  },

  {
    intent: "risks",
    questions: [
      "هل التبرع خطر",
      "هل التبرع مضر",
      "فيه ضرر من التبرع",
      "ضرر التبرع",
      "اضرار التبرع",
      "أضرار التبرع",
      "هل التبرع بيأثر على الصحة",
      "هل ممكن اتعب بعد التبرع",
      "هل التبرع ليه آثار جانبية",
      "هل التبرع ممكن يسبب دوخة",
      "دوخة بعد التبرع",
      "اغماء بعد التبرع",
      "تعب بعد التبرع",
      "هل التبرع بيضعف الجسم",
      "هل التبرع آمن ولا لا",
      "هل سحب الدم خطر"
    ],
    answer: `✅ أمان التبرع بالدم

التبرع غالبًا آمن جدًا لو الشخص مناسب صحيًا.

ممكن يحصل:
• دوخة بسيطة.
• تعب مؤقت.
• ألم خفيف مكان الإبرة.

📌 عشان كده بيتم كشف سريع قبل التبرع، وبعد التبرع يفضل ترتاحي وتشربي سوائل.`
  },

  {
    intent: "blood_types",
    questions: [
      "فصائل الدم",
      "فصيلة الدم",
      "انواع الدم",
      "أنواع الدم",
      "ايه فصائل الدم",
      "الفصائل ايه",
      "يعني ايه A و B",
      "ايه الفرق بين الفصائل",
      "فصائل الدم كام نوع",
      "يعني ايه موجب وسالب",
      "ايه معنى + و - في الدم",
      "هل الفصائل بتفرق في التبرع",
      "مين يتبرع لمين",
      "توافق فصائل الدم"
    ],
    answer: [
      "الفصائل الأساسية هي: A - B - AB - O.",
      "كل فصيلة ممكن تكون موجب (+) أو سالب (-).",
      "الفصيلة بتحدد مين يقدر يتبرع لمين.",
      "O- تعتبر مناسبة في مواقف طارئة كثيرة، لكن التوافق النهائي يحدده بنك الدم."
    ]
  },

  {
    intent: "pregnancy",
    questions: [
      "حامل",
      "الحامل",
      "حمل",
      "رضاعة",
      "برضع",
      "مرضعة",
      "بعد الولادة",
      "قيصرية",
      "هل الحامل ممكن تتبرع",
      "هل الحامل ينفع تتبرع",
      "التبرع للحامل",
      "هل ينفع اتبرع وانا حامل",
      "انا حامل ينفع اتبرع",
      "هل الحمل يمنع التبرع",
      "هل الرضاعة تمنع التبرع",
      "هل ينفع اتبرع وانا برضع",
      "هل ممكن اتبرع بعد الولادة",
      "امتى اقدر اتبرع بعد الولادة"
    ],
    answer: `🤰 الحمل والرضاعة والتبرع

• لا يُنصح بالتبرع أثناء الحمل.
• الرضاعة قد تؤجل التبرع مؤقتًا حسب الحالة.
• بعد الولادة يفضل الانتظار والرجوع للطبيب أو بنك الدم.
• لو في قيصرية أو تعب أو أنيميا، لازم استشارة طبية قبل التبرع.`
  },

  {
    intent: "anemia",
    questions: [
      "انيميا",
      "أنيميا",
      "فقر دم",
      "هيموجلوبين",
      "الهيموجلوبين",
      "نقص حديد",
      "حديد قليل",
      "دمي قليل",
      "عندي انيميا",
      "عندي فقر دم",
      "هل الانيميا تمنع التبرع",
      "هل فقر الدم يمنع التبرع",
      "الهيموجلوبين قليل ينفع اتبرع",
      "نسبة الدم قليلة"
    ],
    answer: `🩸 الأنيميا والتبرع

لو عندك أنيميا أو الهيموجلوبين قليل، غالبًا التبرع بيتأجل.

📌 الأفضل:
• تعملي تحليل هيموجلوبين.
• تعالجي السبب لو موجود.
• تسألي الطبيب أو بنك الدم قبل التبرع.`
  },

  {
    intent: "period",
    questions: [
      "الدورة الشهرية",
      "الدورة",
      "الدوره",
      "البريود",
      "حيض",
      "وقت الدورة",
      "اثناء الدورة",
      "هل ينفع اتبرع وانا في الدورة",
      "هل الدورة تمنع التبرع",
      "ينفع اتبرع وقت البريود",
      "هل التبرع اثناء الدورة خطر",
      "انا في الدورة ينفع اتبرع"
    ],
    answer: `🩸 الدورة الشهرية والتبرع

ممكن التبرع لا يكون مناسبًا أثناء الدورة عند بعض البنات، خصوصًا لو في:
• دوخة.
• نزيف شديد.
• تعب واضح.
• أنيميا.

📌 الأفضل الانتظار لحد ما الحالة تتحسن أو سؤال بنك الدم.`
  },

  {
    intent: "pressure",
    questions: [
      "ضغط الدم",
      "الضغط",
      "مريض ضغط",
      "عندي ضغط",
      "ضغط عالي",
      "ضغط واطي",
      "ضغط منخفض",
      "ضغط مرتفع",
      "هل مريض الضغط يتبرع",
      "هل الضغط يمنع التبرع",
      "ينفع اتبرع وعندي ضغط",
      "مريض الضغط ينفع يتبرع",
      "لو حد ضغطه مش متظبط ممكن يتبرع"

    ],
    answer: `🩺 الضغط والتبرع

مريض الضغط ممكن يتبرع أحيانًا لو الضغط مستقر والحالة مناسبة.

لكن التبرع قد يتأجل لو:
• الضغط عالي جدًا.
• الضغط منخفض جدًا.
• في دوخة أو تعب.
• الدواء أو الحالة غير مستقرة.

📌 القرار النهائي حسب قياس الضغط في بنك الدم.`
  },

  {
    intent: "diabetes",
    questions: [
      "مرض السكر",
      "السكر",
      "سكري",
      "مريض سكر",
      "عندي سكر",
      "سكر عالي",
      "سكر منخفض",
      "هل مريض السكر يتبرع",
      "هل السكر يمنع التبرع",
      "ينفع اتبرع وانا عندي سكر",
      "مريض السكر ينفع يتبرع"
    ],
    answer: `🩺 السكر والتبرع

مريض السكر ممكن يتبرع في بعض الحالات لو السكر مستقر والحالة العامة كويسة.

لكن التبرع قد يتأجل لو:
• السكر غير منتظم.
• في مضاعفات.
• في تعب أو هبوط.
• الطبيب أو بنك الدم شايف إن التبرع غير مناسب.

📌 الأفضل سؤال الطبيب أو بنك الدم.`
  },

  {
    intent: "cold_fever",
    questions: [
      "دور برد",
      "برد شديد",
      "برد",
      "سخونية",
      "حرارة",
      "كحة",
      "انفلونزا",
      "نزلة برد",
      "عدوى",
      "التهاب",
      "عندي برد ينفع اتبرع",
      "هل السخونية تمنع التبرع",
      "هل الكحة تمنع التبرع",
      "ينفع اتبرع وانا عيان",
      "عندي حرارة اتبرع"
    ],
    answer: `🤒 البرد أو السخونية والتبرع

لو عندك برد شديد، سخونية، كحة قوية، أو عدوى نشطة، الأفضل تأجيل التبرع.

📌 استني لحد ما تخفي تمامًا، وبعدها اسألي بنك الدم لو ينفع تتبرعي.`
  },

  {
    intent: "medicines",
    questions: [
      "دواء",
      "ادوية",
      "أدوية",
      "علاج",
      "باخد علاج",
      "باخد دواء",
      "مضاد حيوي",
      "مسكن",
      "اسبرين",
      "كورتيزون",
      "هل الدواء يمنع التبرع",
      "ينفع اتبرع وانا باخد دواء",
      "ينفع اتبرع وانا باخد مضاد حيوي",
      "هل المضاد الحيوي يمنع التبرع"
    ],
    answer: `💊 الأدوية والتبرع

بعض الأدوية لا تمنع التبرع، وبعضها ممكن يؤجل التبرع.

📌 لازم تقولي للطبيب في بنك الدم:
• اسم الدواء.
• الجرعة.
• سبب استخدامه.
• آخر مرة أخدتيه فيها.`
  },

  {
    intent: "tattoo_surgery",
    questions: [
      "تاتو",
      "وشم",
      "بيرسينج",
      "خرم",
      "عملية",
      "جراحة",
      "اسنان",
      "أسنان",
      "خلع ضرس",
      "حشو",
      "تنضيف اسنان",
      "عملت عملية",
      "بعد عملية",
      "هل العملية تمنع التبرع",
      "هل التاتو يمنع التبرع",
      "هل خلع الضرس يمنع التبرع",
      "عملت تاتو ينفع اتبرع"
    ],
    answer: `🩹 العمليات أو التاتو أو إجراءات الأسنان

بعض الإجراءات ممكن تأجل التبرع مؤقتًا، زي:
• عملية حديثة.
• تاتو أو بيرسينج جديد.
• خلع ضرس أو إجراء أسنان كبير.
• جرح أو التهاب.

📌  المدة تختلف حسب الحالة، فالأفضل سؤال بنك الدم او دكتور .`
  },

  {
    intent: "food",
    questions: [
      "اكل قبل التبرع",
      "أكل قبل التبرع",
      "اشرب قبل التبرع",
      "مياه قبل التبرع",
      "مياه بعد التبرع",
      "قهوة قبل التبرع",
      "صايم",
      "صيام",
      "هل ينفع اتبرع وانا صايم",
      "ممنوعات قبل التبرع",
      "اكل ايه قبل التبرع",
      "هل القهوة مسموحة",
      "هل الاكل مهم قبل التبرع",
      "ايه افضل اكل قبل التبرع",
      "اشرب ايه قبل التبرع",
      "هل ينفع اتبرع من غير ما اكل"
    ],
    answer: [
      "يفضل تاكلي وجبة خفيفة قبل التبرع.",
      "اشربي مياه كويس قبل وبعد التبرع.",
      "تجنبي الأكل الدسم أو الثقيل قبل التبرع.",
      "الأفضل ما تروحيش للتبرع وانتي صايمة أو مرهقة.",
      "القهوة وحدها مش بديل عن المياه والأكل الخفيف."
    ]
  },

  {
    intent: "donation_process",
    questions: [
      "خطوات التبرع",
      "عملية التبرع",
      "ازاي بتتم عملية التبرع",
      "خطوات التبرع بالدم",
      "بيحصل ايه في التبرع",
      "شرح التبرع بالدم",
      "التبرع بالدم بيتم ازاي",
      "مراحل التبرع",
      "ايه اللي بيحصل وقت التبرع",
      "اول ما اروح بنك الدم اعمل ايه",
      "اجراءات التبرع"
    ],
    answer: [
      "بتبدأي بتسجيل بياناتك في بنك الدم.",
      "بعدها كشف بسيط على الضغط والهيموجلوبين.",
      "لو الحالة مناسبة، بيتم سحب الدم في حوالي 10 دقايق.",
      "بعد التبرع بترتاحي وتشربي سوائل."
    ]
  },

  {
    intent: "emergency",
    questions: [
      "طوارئ",
      "حالات طوارئ",
      "حالة طارئة",
      "محتاج دم",
      "محتاجة دم",
      "طلب دم",
      "طلبات دم",
      "فيه حد محتاج دم",
      "في حالات طوارئ",
      "في طلب دم",
      "ايه الحالات الحالية",
      "هل في حد محتاج تبرع بالدم",
      "في حالات محتاجة دم دلوقتي",
      "في حد طالب دم",
      "هل في طلبات دم حاليا",
      "ايه اخر حالات الطوارئ"
    ]
  },

  {
    intent: "donation_options",
    questions: [
      "عايز اتبرع",
      "عايزة اتبرع",
      "عاوزه اتبرع",
      "حابب اتبرع",
      "حابة اتبرع",
      "احب اتبرع",
      "عايز ابقى متبرع",
      "عايز اكون متبرع",
      "ابدأ اتبرع",
      "عايز اتطوع للتبرع",
      "انا عايز اتبرع",
      "انا عايزة اتبرع"
    ]
  },

  {
    intent: "can_i_donate_flow",
    questions: [
      "ممكن اتبرع",
      "ينفع اتبرع",
      "اقدر اتبرع",
      "أقدر أتبرع",
      "هل اقدر اتبرع",
      "هل أقدر أتبرع",
      "هل ممكن اتبرع",
      "هل ينفع اتبرع",
      "ينفع اتبرع دلوقتي",
      "انا ينفع اتبرع",
      "هل انا مناسب للتبرع",
      "ينفع اتبرع ولا لا",
      "هل حالتي تسمح اتبرع"
    ]
  },

  {
    intent: "register_link",
    questions: [
      "سجلني",
      "سجليني",
      "اسجل",
      "أسجل",
      "تسجيل",
      "تسجيل كمتبرع",
      "اسجل كمتبرع",
      "ازاي اسجل كمتبرع",
      "فين اسجل للتبرع",
      "رابط التسجيل",
      "لينك التسجيل",
      "افتح صفحة التسجيل",
      "ادخل صفحة التسجيل",
      "صفحة سجل كمتبرع",
      "عايز رابط التسجيل"
    ]
  }
];

/* =========================
   3) Text Helpers
========================= */

function normalize(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/گ/g, "ك")
    .replace(/[^\u0600-\u06FFa-z0-9+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(blood|dam)/g, "دم")
    .replace(/(donate|tabaro3|tbaro3)/g, "تبرع")
    .replace(/(pregnant)/g, "حامل")
    .trim();
}

const stopWords = [
  "هل", "ممكن", "ينفع", "اقدر", "أقدر", "انا", "لو", "في", "عن", "من", "الى", "إلى",
  "ايه", "إيه", "اي", "هو", "هي", "ده", "دي", "دا", "ولا", "او", "أو", "على", "علي",
  "عايز", "عايزه", "عايزة", "عاوزه", "حابب", "حابه", "حابة", "محتاج", "محتاجه",
  "التبرع", "تبرع", "اتبرع", "بالدم", "دم", "مسموح"
].map(normalize);

function getImportantWords(text) {
  return normalize(text)
    .split(" ")
    .map(word => word.trim())
    .filter(word => word.length > 1)
    .filter(word => !stopWords.includes(word));
}

function includesAny(normalizedMessage, words) {
  return words.some(word => normalizedMessage.includes(normalize(word)));
}

function formatAnswer(answer) {
  if (!answer) return "";

  if (Array.isArray(answer)) {
    return answer
      .map(item => String(item).trim())
      .filter(Boolean)
      .map(item => item.startsWith("•") ? item : `• ${item.replace(/^-+\s*/, "")}`)
      .join("\n");
  }

  return String(answer).trim();
}

function buildBankReply(city, bank, bloodType = null) {
  return `${bloodType ? `🩸 فصيلتك:\n${bloodType}\n\n` : ""}📍 بنك الدم في ${city}

العنوان:
${bank.address}

📞 التليفون:
${bank.phones.join(" - ")}

📌 يفضل التواصل مع البنك قبل الذهاب للتأكد من المواعيد.`;
}

function buildAllBloodBanksReply() {
  return Object.entries(bloodBanks)
    .map(([city, bank]) => `📍 ${city}

العنوان:
${bank.address}

📞 التليفون:
${bank.phones.join(" - ")}`)
    .join("\n\n----------------------\n\n");
}

function findCity(message) {
  const normalizedMessage = normalize(message);

  for (const city in bloodBanks) {
    const names = [city, ...(bloodBanks[city].aliases || [])];

    for (const name of names) {
      const normalizedName = normalize(name);

      if (
        normalizedMessage.includes(normalizedName) ||
        normalizedName.includes(normalizedMessage)
      ) {
        return city;
      }
    }
  }

  return null;
}

function findGovernorate(message) {
  const normalizedMessage = normalize(message);

  for (const governorate in governoratesMap) {
    const names = [governorate, ...(governoratesMap[governorate].aliases || [])];

    for (const name of names) {
      const normalizedName = normalize(name);

      if (
        normalizedMessage.includes(normalizedName) ||
        normalizedName.includes(normalizedMessage)
      ) {
        return governorate;
      }
    }
  }

  return null;
}

function getNearestAvailableGovernorate(governorate) {
  if (!governorate) return null;

  if (bloodBanks[governorate]) return governorate;

  const nearestList = governoratesMap[governorate]?.nearest || [];

  for (const nearest of nearestList) {
    if (bloodBanks[nearest]) return nearest;
  }

  return null;
}

function detectDonationIntent(normalizedMessage) {
  if (
    includesAny(normalizedMessage, [
      "ممكن اتبرع",
      "ينفع اتبرع",
      "اقدر اتبرع",
      "هل اقدر اتبرع",
      "هل ممكن اتبرع",
      "هل ينفع اتبرع",
      "ينفع اتبرع ولا لا",
      "ينفع اتبرع ولا لأ"
    ])
  ) {
    return "can_i_donate_flow";
  }

  if (
    includesAny(normalizedMessage, [
      "عايز اتبرع",
      "عايزه اتبرع",
      "عايزة اتبرع",
      "عاوزه اتبرع",
      "حابب اتبرع",
      "حابه اتبرع",
      "حابة اتبرع",
      "احب اتبرع",
      "عايز ابقي متبرع",
      "عايز ابقى متبرع"
    ])
  ) {
    return "donation_options";
  }

  if (
    includesAny(normalizedMessage, [
      "سجلني",
      "سجليني",
      "اسجل",
      "تسجيل",
      "رابط التسجيل",
      "لينك التسجيل",
      "افتح صفحه التسجيل",
      "صفحه التسجيل"
    ])
  ) {
    return "register_link";
  }

  return null;
}

/* =========================
   4) Smart Search
========================= */

const allQuestions = faq.flatMap(item =>
  item.questions.map(q => ({
    question: q,
    normalizedQuestion: normalize(q),
    intent: item.intent
  }))
);

const fuse = new Fuse(allQuestions, {
  keys: ["normalizedQuestion"],
  threshold: 0.38,
  includeScore: true,
  ignoreLocation: true
});

function findBestMatch(message) {
  const normalizedMessage = normalize(message);

  if (!normalizedMessage) return null;

  let directBestItem = null;
  let directBestLength = 0;

  for (const item of faq) {
    for (const q of item.questions) {
      const normalizedQuestion = normalize(q);

      if (!normalizedQuestion) continue;

      const isMatch =
        normalizedMessage.includes(normalizedQuestion) ||
        normalizedQuestion.includes(normalizedMessage);

      if (isMatch && normalizedQuestion.length > directBestLength) {
        directBestItem = item;
        directBestLength = normalizedQuestion.length;
      }
    }
  }

  if (directBestItem) {
    return directBestItem;
  }

  let bestItem = null;
  let bestScore = 0;

  for (const item of faq) {
    for (const q of item.questions) {
      const words = getImportantWords(q);

      if (!words.length) continue;

      const matchedWords = words.filter(word => normalizedMessage.includes(word));
      const score = matchedWords.length / words.length;

      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
  }

  if (bestItem && bestScore >= 0.6) {
    return bestItem;
  }

  const results = fuse.search(normalizedMessage);

  if (!results.length) return null;

  const best = results[0];

  if (best.score !== undefined && best.score > 0.45) return null;

  return faq.find(item => item.intent === best.item.intent) || null;
}

/* =========================
   5) Special Handlers
========================= */

function getDonationChoiceReply() {
  return {
    reply: `جميل جدًا ❤️

تحبي تعملي إيه؟

1️⃣ أتأكد الأول هل ينفع أتبرع ولا لا
2️⃣ أسجل مباشرة كمتبرعة`,
    suggestions: ["1", "2"]
  };
}

function getRegisterReply() {
  return {
    reply: `🩸 التسجيل كمتبرع

سجّلي بياناتك من هنا:
http://localhost:3000/register

📌 بعد التسجيل:
لو ظهرت حالة محتاجة نفس فصيلتك، هنتواصل معاكي فورًا ❤️`,
    suggestions: ["هل أقدر أتبرع؟", "شروط التبرع", "أماكن بنوك الدم"]
  };
}

function startEligibilityFlow(userId) {
  userState[userId] = { step: "ask_blood_type" };

  return {
    reply: `تمام 👌

خلينا نتأكد الأول هل تقدري تتبرعي ولا لا.

🩸 قوليلي فصيلة دمك إيه؟`,
    suggestions: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  };
}

async function handleEmergency() {
  try {
    const ads = await EmergencyAd.find({
      $or: [
        { status: "active" },
        { isActive: true }
      ],
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }).sort({ createdAt: -1 });

    if (!ads.length) {
      return {
        reply: `حاليًا مفيش حالات طوارئ 😌

لكن تقدري تسجلي كمتبرعة من هنا:
http://localhost:3000/register

📌 أول ما تظهر حالة مناسبة لفصيلتك، هنتواصل معاكي فورًا ❤️`,
        suggestions: ["عايزة أتبرع", "أماكن بنوك الدم", "شروط التبرع"]
      };
    }

    const response = ads.map((ad, index) =>
      `🚨 حالة طوارئ رقم ${index + 1}

🩸 الفصيلة المطلوبة:
${ad.bloodType}

📍 المحافظة:
${ad.governorate}

📝 التفاصيل:
${ad.message}`
    );

    return {
      reply: response.join("\n\n----------------------\n\n"),
      suggestions: ["عايزة أتبرع", "شروط التبرع", "أماكن بنوك الدم"]
    };

  } catch (error) {
    console.error("Emergency Error:", error);

    return {
      reply: "حصل خطأ في جلب حالات الطوارئ. جربي تاني بعد لحظات."
    };
  }
}

/* =========================
   6) Main Route
========================= */

router.post("/", async (req, res) => {
  try {
    const message = req.body.message || "";
    const userId = req.body.userId || "default";
    const normalizedMessage = normalize(message);

    if (!normalizedMessage) {
      return res.json({
        reply: "اكتبي سؤالك وأنا أساعدك 👌",
        suggestions: ["شروط التبرع", "هل أقدر أتبرع؟", "فيه حالات طوارئ؟"]
      });
    }

    if (userState[userId]?.step === "donation_choice") {
      if (
        normalizedMessage === "1" ||
        includesAny(normalizedMessage, ["اتأكد", "اتاكد", "ينفع", "اقدر", "ممكن", "اختيار 1", "الاول"])
      ) {
        return res.json(startEligibilityFlow(userId));
      }

      if (
        normalizedMessage === "2" ||
        includesAny(normalizedMessage, ["اسجل", "سجل", "تسجيل", "مباشره", "اختيار 2", "الثاني"])
      ) {
        userState[userId] = {};
        return res.json(getRegisterReply());
      }

      return res.json({
        reply: `اختاري رقم 1 أو 2 👇

1️⃣ أتأكد الأول هل ينفع أتبرع ولا لا
2️⃣ أسجل مباشرة كمتبرعة`,
        suggestions: ["1", "2"]
      });
    }

    if (userState[userId]?.step === "ask_blood_type") {
      const bloodType = message.toUpperCase().replace(/\s+/g, "").trim();
      const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

      if (!validBloodTypes.includes(bloodType)) {
        return res.json({
          reply: "قولي فصيلة دم صحيحة من الاختيارات دي 👇",
          suggestions: validBloodTypes
        });
      }

      userState[userId] = {
        step: "ask_city",
        bloodType
      };

      return res.json({
        reply: `تمام 👌

🩸 فصيلتك:
${bloodType}

📍 قوليلي محافظتك إيه؟`
      });
    }

    if (userState[userId]?.step === "ask_city") {
      const bloodType = userState[userId].bloodType;

      const foundCity = findCity(message);
      const requestedGovernorate = findGovernorate(message);
      const nearestGovernorate = getNearestAvailableGovernorate(requestedGovernorate);

      userState[userId] = {};

      if (foundCity) {
        const bank = bloodBanks[foundCity];

        return res.json({
          reply: buildBankReply(foundCity, bank, bloodType),
          suggestions: ["شروط التبرع", "فيه حالات طوارئ؟"]
        });
      }

      if (nearestGovernorate) {
        const bank = bloodBanks[nearestGovernorate];

        if (requestedGovernorate === nearestGovernorate) {
          return res.json({
            reply: buildBankReply(nearestGovernorate, bank, bloodType),
            suggestions: ["شروط التبرع", "فيه حالات طوارئ؟"]
          });
        }

        return res.json({
          reply: `🩸 فصيلتك:
${bloodType}

⚠️ محافظة ${requestedGovernorate} غير متوفر فيها بنك دم حاليًا داخل المنصة.

✅ أقرب محافظة متوفر فيها بنك دم:
${nearestGovernorate}

📍 بيانات بنك الدم:
العنوان:
${bank.address}

📞 التليفون:
${bank.phones.join(" - ")}

📌 يفضل التواصل مع البنك قبل الذهاب للتأكد من المواعيد.`,
          suggestions: ["شروط التبرع", "فيه حالات طوارئ؟", "أماكن بنوك الدم"]
        });
      }

      return res.json({
        reply: "مش قادر أحدد المحافظة دي حاليًا 😅 اكتبي اسم المحافظة بشكل أوضح.",
        suggestions: Object.keys(bloodBanks)
      });
    }

    const donationIntent = detectDonationIntent(normalizedMessage);

    if (donationIntent === "can_i_donate_flow") {
      return res.json(startEligibilityFlow(userId));
    }

    if (donationIntent === "donation_options") {
      userState[userId] = { step: "donation_choice" };
      return res.json(getDonationChoiceReply());
    }

    if (donationIntent === "register_link") {
      return res.json(getRegisterReply());
    }

    const directCity = findCity(message);

    if (directCity) {
      const bank = bloodBanks[directCity];

      return res.json({
        reply: buildBankReply(directCity, bank),
        suggestions: ["شروط التبرع", "هل أقدر أتبرع؟", "فيه حالات طوارئ؟"]
      });
    }

    const result = findBestMatch(message);

    if (!result) {
      return res.json({
        reply: `مش متأكد إني فهمت سؤالك 😅

ممكن تختاري من الاقتراحات دي:`,
        suggestions: [
          "شروط التبرع",
          "هل أقدر أتبرع؟",
          "فيه حالات طوارئ؟",
          "أماكن بنوك الدم",
          "موانع التبرع"
        ]
      });
    }

    if (result.intent === "emergency") {
      const response = await handleEmergency();
      return res.json(response);
    }

    if (result.intent === "donation_options") {
      userState[userId] = { step: "donation_choice" };
      return res.json(getDonationChoiceReply());
    }

    if (result.intent === "can_i_donate_flow") {
      return res.json(startEligibilityFlow(userId));
    }

    if (result.intent === "register_link") {
      return res.json(getRegisterReply());
    }

    return res.json({
      reply: formatAnswer(result.answer),
      suggestions: ["هل أقدر أتبرع؟", "أماكن بنوك الدم", "فيه حالات طوارئ؟"]
    });

  } catch (error) {
    console.error("Chatbot Error:", error);

    return res.status(500).json({
      reply: "حصل خطأ في الشات بوت. جربي تاني بعد لحظات."
    });
  }
});

module.exports = router;