#!/usr/bin/env python3
"""Regenerates the components + templates blocks of twilight-bundle.json."""
import json, uuid, copy, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
NS = uuid.UUID('6f1d2c7e-5a1b-4a56-9d0e-3b8f7a1c0w00'.replace('w', '0'))
def key(n): return str(uuid.uuid5(NS, n))

def text(id, label, value='', icon='sicon-format-text-alt', required=False, maxl=120, fmt='text', **kw):
    f = dict(id=id, icon=icon, type='string', format=fmt, label=label, required=required, value=value, maxLength=maxl)
    if fmt == 'textarea': f['rows'] = kw.pop('rows', 3)
    f.update(kw); return f
def link(id, label, value='#products'):
    return dict(id=id, icon='sicon-link', type='string', format='text', label=label, required=False, value=value, maxLength=300,
                description='رابط خارجي أو #products للنزول لقسم المنتجات')
def color(id='accent', value='#E4572E'):
    return dict(id=id, icon='sicon-color-palette', format='color', type='string', inputType='color', label='اللون الرئيسي', required=False, value=value)
def image(id, label, value=''):
    return dict(id=id, icon='sicon-image-landscape', type='string', format='image', label=label, required=False, value=value)
def coll(id, label, item_label, fields, value, mn=1, mx=8):
    return dict(id=id, icon='sicon-list', type='collection', label=label, item_label=item_label, minLength=mn, maxLength=mx, value=value, fields=fields)

def comp(name, title, icon, fields):
    return dict(title=title, icon=icon, name=name, key=key(name), image='', fields=fields)

HERO = comp('wahja-hero', 'الواجهة الرئيسية', 'sicon-image-landscape', [
    text('eyebrow', 'نص صغير فوق العنوان', 'تشكيلة الموسم الجديد'),
    text('title', 'العنوان الرئيسي', 'أناقة تبدأ من أول إطلالة', required=True, maxl=90),
    text('subtitle', 'الوصف', 'قطع مختارة بخامات مريحة وتفاصيل تفرّقك، بدون مبالغة في السعر.', fmt='textarea', maxl=220, icon='sicon-format-text-alt'),
    text('cta_text', 'نص الزر', 'تسوّقي التشكيلة', maxl=30),
    link('cta_link', 'رابط الزر'),
    image('image', 'صورة الخلفية'),
    dict(id='overlay', icon='sicon-image-landscape', type='number', label='تعتيم الصورة (%)', required=False, value=45, minimum=0, maximum=90, step=5, inputType='range'),
    dict(id='align', icon='sicon-align-center', type='items', label='محاذاة النص', format='radio-list', required=False,
         options=[dict(label='بداية السطر', value='start', key='start'), dict(label='توسيط', value='center', key='center')],
         selected=[dict(label='بداية السطر', value='start', key='start')]),
    color(),
    dict(id='end_date', icon='sicon-calendar', type='string', format='datetime', inputType='date', label='نهاية العرض (عدّاد تنازلي اختياري)', required=False, value=''),
])
PAIN_F = [text('title', 'عنوان', required=True, maxl=60), text('text', 'وصف', maxl=160, fmt='textarea')]
PAIN = comp('wahja-pain', 'المشكلة', 'sicon-help', [
    text('eyebrow', 'نص صغير', 'تعرفي الشعور ده'),
    text('title', 'العنوان', 'ليه الاختيار بقى متعب؟', required=True, maxl=90),
    text('subtitle', 'وصف', '', maxl=200, fmt='textarea'),
    coll('items', 'النقاط', 'نقطة', PAIN_F, [
        dict(title='خامات بتتبهدل من أول غسلة', text='تدفعي كتير وبعدها القطعة تفقد شكلها بسرعة.'),
        dict(title='مقاسات مش واضحة', text='تطلبي وانتي مش متأكدة، وتفضلي قلقانة من الإرجاع.'),
        dict(title='نفس الموديلات في كل مكان', text='صعب تلاقي قطعة تحسّيها بتشبهك.'),
    ], 1, 4),
    color(),
])
SOL_F = [text('title', 'عنوان', required=True, maxl=60), text('text', 'وصف', maxl=160, fmt='textarea')]
FEAT = comp('wahja-features', 'المميزات', 'sicon-star', [
    text('eyebrow', 'نص صغير', 'الحل'),
    text('title', 'العنوان', 'اللي هتلاقيه في كل قطعة', required=True, maxl=90),
    text('subtitle', 'وصف', '', maxl=200, fmt='textarea'),
    coll('items', 'المميزات', 'ميزة', SOL_F, [
        dict(title='خامة مريحة', text='أقمشة بتتحمل الاستخدام اليومي وتحافظ على شكلها.'),
        dict(title='قصّات مدروسة', text='مقاسات واضحة وجدول قياسات في كل منتج.'),
        dict(title='تصاميم مميزة', text='تفاصيل بسيطة بتفرّق من غير ما تلفت زيادة.'),
        dict(title='شحن وإرجاع سهل', text='سياسة واضحة قبل ما تطلبي.'),
    ], 1, 4),
    color(),
])
PROD = comp('wahja-products', 'المنتجات', 'sicon-box', [
    text('eyebrow', 'نص صغير', 'اختياراتنا'),
    text('title', 'العنوان', 'الأكثر طلبًا الأسبوع ده', required=True, maxl=90),
    text('subtitle', 'وصف', '', maxl=200, fmt='textarea'),
    text('cta_text', 'نص زر المنتج', 'اختاري المقاس', maxl=24),
    dict(id='products', icon='sicon-box', type='items', label='المنتجات (حتى 8)', format='dropdown-list', multichoice=True, searchable=True, required=True,
         source='products', description='اختار المنتجات اللي تظهر في الصفحة'),
    color(),
])
TEST_F = [text('quote', 'التقييم', required=True, maxl=220, fmt='textarea'), text('name', 'الاسم', maxl=40), text('meta', 'تفاصيل (المدينة مثلًا)', maxl=40)]
TEST = comp('wahja-testimonials', 'آراء العملاء', 'sicon-chat', [
    text('eyebrow', 'نص صغير', 'آراء العملاء'),
    text('title', 'العنوان', 'اللي قالوه بعد التجربة', required=True, maxl=90),
    coll('items', 'الآراء', 'رأي', TEST_F, [
        dict(quote='[اكتب هنا رأي عميل حقيقي]', name='اسم العميل', meta='المدينة'),
        dict(quote='[اكتب هنا رأي عميل حقيقي]', name='اسم العميل', meta='المدينة'),
        dict(quote='[اكتب هنا رأي عميل حقيقي]', name='اسم العميل', meta='المدينة'),
    ], 1, 6),
    color(),
])
FAQ_F = [text('question', 'السؤال', required=True, maxl=120), text('answer', 'الإجابة', required=True, maxl=400, fmt='textarea')]
FAQ = comp('wahja-faq', 'الأسئلة الشائعة', 'sicon-question-mark', [
    text('eyebrow', 'نص صغير', 'أسئلة شائعة'),
    text('title', 'العنوان', 'قبل ما تطلبي', required=True, maxl=90),
    coll('items', 'الأسئلة', 'سؤال', FAQ_F, [
        dict(question='إزاي أختار المقاس؟', answer='في صفحة كل منتج جدول قياسات. لو بين مقاسين، اختاري الأكبر.'),
        dict(question='مدة الشحن قد إيه؟', answer='اكتب هنا مدة الشحن حسب مناطقك.'),
        dict(question='لو المقاس مش مظبوط؟', answer='اكتب هنا سياسة الاستبدال والإرجاع الخاصة بمتجرك.'),
    ], 1, 8),
    color(),
])
CTA = comp('wahja-cta', 'دعوة أخيرة', 'sicon-shopping-bag', [
    text('title', 'العنوان', 'جاهزة تكملي إطلالتك؟', required=True, maxl=80),
    text('text', 'وصف', 'اختاري قطعتك قبل ما تخلص الكمية.', maxl=160, fmt='textarea'),
    text('cta_text', 'نص الزر', 'اطلبي الآن', maxl=30),
    link('cta_link', 'رابط الزر'),
    coll('points', 'نقاط الطمأنة', 'نقطة', [text('text', 'النص', maxl=40)], [dict(text='شحن سريع'), dict(text='استبدال سهل'), dict(text='دفع آمن')], 0, 4),
    color(),
])
COMPONENTS = [HERO, PAIN, FEAT, PROD, TEST, FAQ, CTA]
BY = {c['name']: c for c in COMPONENTS}

def tpl(overrides, order, accent):
    out = []
    for n in order:
        c = copy.deepcopy(BY[n]); o = overrides.get(n, {}); o.setdefault('accent', accent)
        for f in c['fields']:
            if f['id'] in o: f['selected' if f['type']=='items' else 'value'] = o[f['id']]
        out.append(c)
    return dict(components=out)

ORDER = ['wahja-hero', 'wahja-pain', 'wahja-features', 'wahja-products', 'wahja-testimonials', 'wahja-faq', 'wahja-cta']
TEMPLATES = {
 'launch': (tpl({}, ORDER, '#E4572E'), '#E4572E'),
 'sale': (tpl({
    'wahja-hero': dict(eyebrow='عرض لفترة محدودة', title='خصم على أكثر القطع طلبًا', subtitle='الكميات محدودة، والعرض بينتهي مع العدّاد.', cta_text='شوفي العروض', align=[dict(label='توسيط', value='center', key='center')]),
    'wahja-products': dict(eyebrow='العروض', title='قطع بسعر خاص', cta_text='اختاري المقاس'),
    'wahja-cta': dict(title='العرض مش هيستنّى', text='ثبّتي قطعتك قبل نهاية العدّاد.', cta_text='تسوّقي العرض'),
 }, ORDER, '#C2185B'), '#C2185B'),
 'essentials': (tpl({
    'wahja-hero': dict(eyebrow='الأساسيات', title='قطع تلبسيها كل يوم', subtitle='ألوان هادية وخامات مريحة تتنسق مع كل حاجة.', cta_text='شوفي الأساسيات'),
    'wahja-products': dict(eyebrow='الأساسيات', title='ابدئي من هنا'),
 }, ['wahja-hero', 'wahja-features', 'wahja-products', 'wahja-testimonials', 'wahja-faq', 'wahja-cta'], '#2F6F5E'), '#2F6F5E'),
}

def main():
    p = ROOT / 'twilight-bundle.json'
    d = json.loads(p.read_text(encoding='utf8'))
    d['components'] = COMPONENTS
    d['features'] = ['landing-page-templates']
    d['templates'] = []
    (ROOT / 'templates').mkdir(exist_ok=True)
    for i, (name, (body, accent)) in enumerate(TEMPLATES.items()):
        tid = str(uuid.uuid5(NS, 'tpl-' + name))
        body = dict(id=tid, **body)
        (ROOT / 'templates' / f'{name}.json').write_text(json.dumps(body, ensure_ascii=False, indent=2), encoding='utf8')
        d['templates'].append(dict(id=tid, path=f'templates.{name}', category_id='', primary_color=accent, thumbnail='', is_default=(i == 0)))
    p.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf8')
    print('components', len(COMPONENTS), 'templates', len(TEMPLATES))
main()
