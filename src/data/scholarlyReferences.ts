import { ScholarlyReference } from '../types/library';

export const SCHOLARLY_REFERENCES: ScholarlyReference[] = [
  {
    id: 'ref-1',
    title: 'A Coptic Dictionary (القاموس القبطي الشامل)',
    author: 'Walter Ewing Crum (والتر كرام)',
    type: 'معجم ومصدر لغوي',
    category: 'اللغة القبطية وفيلولوجيا المخطوطات',
    bibliographicCitation: 'Crum, W. E. (1939). A Coptic Dictionary. Oxford: Clarendon Press. (Reprinted by Peeters, 2005).',
    description: 'المرجع اللغوي الأكاديمي القياسي العالمي الأول لمفردات اللغة القبطية بجميع لهجاتها (الصعيدية، البحيرية، الأخميمية، الفيومية)، مع تتبع الأصول المصرية القديمة ومطابقة الاستخدام اليوناني في الترجمات الكنسية.',
    externalUrl: 'https://coptic-dictionary.org',
    availabilityType: 'مستودع كنسي رقمي',
    targetVocations: ['الكل']
  },
  {
    id: 'ref-2',
    title: 'Clavis Patrum Graecorum (CPG - مفتاح الآباء اليونانيين)',
    author: 'Maurice Geerard & Jacques Noret',
    type: 'مرجع آبائي',
    category: 'الباترولوجيا والتوثيق المخطوطي',
    bibliographicCitation: 'Geerard, M. (1974-2003). Clavis Patrum Graecorum (Vols. I-V + Supplementum). Turnhout: Brepols.',
    description: 'الفهرس المعتمد دولياً لجميع نصوص ومصنفات آباء الكنيسة باللغة اليونانية والترجمات القبطية والسريانية واللاتينية القديمة، لتحديد أصالة النصوص وتوثيق نسبتها التاريخية الصحيحة.',
    availabilityType: 'بيانات ببليوغرافية وتوثيق',
    targetVocations: ['الكل']
  },
  {
    id: 'ref-3',
    title: 'فهرس المخطوطات القبطية بالمتحف القبطي والبطريركية',
    author: 'مرقس سميكة باشا ويس عبد المسيح',
    type: 'دراسة تاريخية',
    category: 'علم المخطوطات القبطية والكنسية',
    bibliographicCitation: 'سميكة، مرقس (1939-1942). دليل المتحف القبطي وفهرس المخطوطات القبطية والعربية. المطبعة الأميرية بالقاهرة.',
    description: 'التوثيق العلمي الشامل للمخطوطات الليتورجية والتفسيرية والتاريخية المحفوظة في مكتبات الأديرة والبطريركية والمتحف القبطي بمصر القديمة.',
    availabilityType: 'بيانات ببليوغرافية وتوثيق',
    targetVocations: ['الكل']
  },
  {
    id: 'ref-4',
    title: 'موسوعة آباء الكنيسة الأوائل (Ante-Nicene & Nicene Fathers)',
    author: 'Alexander Roberts, James Donaldson & Philip Schaff',
    type: 'مرجع آبائي',
    category: 'نصوص الآباء والترجمات النقدية',
    bibliographicCitation: 'Schaff, P. (Ed.). (1885-1900). A Select Library of the Nicene and Post-Nicene Fathers of the Christian Church (Series I & II). Grand Rapids: Eerdmans.',
    description: 'المجموعة الجامعة لأعمال القديس أثناسيوس السكندري، يوحنا كاسيان، يوحنا ذهبي الفم، كيرلس الأورشليمي، وأمهات وآباء البرية مع الحواشي التاريخية واللاهوتية النقدية.',
    externalUrl: 'https://www.newadvent.org/fathers/',
    availabilityType: 'نص كامل متاح',
    targetVocations: ['الكل']
  },
  {
    id: 'ref-5',
    title: 'دليل الناسك في قواعد التفسير وعظات الكتاب المقدس',
    author: 'إعداد مشترك لأساتذة الإكليريكية واللجان الرعوية',
    type: 'دليل إعداد العظات',
    category: 'الرعاية والوعظ',
    bibliographicCitation: 'الكلية الإكليريكية اللاهوتية (2019). الدليل الإرشادي لإعداد العظات والدراسات الكتابية في الكنيسة القبطية الأرثوذكسية. القاهرة.',
    description: 'دليل عملي ومنهجي موثق يربط آيات قطمارس القداسات اليومية والأعياد بالتأملات الآبائية، مع استمارة تقييم ومراجعة ذاتية للكاهن والخادمة.',
    availabilityType: 'نص كامل متاح',
    targetVocations: ['كاهن', 'مكرسة']
  }
];
