import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "data", "companies");
fs.mkdirSync(outDir, { recursive: true });

const industries = {
  "IT / 软件 / AI": {
    positions: ["软件工程师", "AI工程师", "后端工程师", "项目经理", "数据分析师"],
    skills: ["TypeScript", "Python", "云服务", "SQL", "机器学习", "日语沟通"],
    products: ["受托开发", "SaaS", "AI解决方案", "业务系统"],
    remote: "混合办公为主，工程岗位每周二至四天远程",
    dress: "商务休闲",
    review: ["技术栈较新", "年轻员工多", "项目变化快"],
  },
  "制造业": {
    positions: ["机械设计", "电气设计", "生产技术", "品质管理", "海外营业"],
    skills: ["CAD", "PLC", "品质改善", "日语报告", "供应链理解"],
    products: ["精密零部件", "工业设备", "电子部件", "检测装置"],
    remote: "原则到岗，设计和管理岗位可部分远程",
    dress: "办公室商务休闲，工厂制服",
    review: ["技术积累深", "现场沟通多", "地方据点较多"],
  },
  "贸易 / 商社": {
    positions: ["法人营业", "贸易事务", "采购", "海外业务", "物流协调"],
    skills: ["商务日语", "英语/中文", "Excel", "交涉力", "贸易实务"],
    products: ["工业材料贸易", "食品进出口", "机械设备代理", "跨境采购"],
    remote: "到岗为主，部分事务岗位可混合办公",
    dress: "商务正装或商务休闲",
    review: ["业务范围广", "客户沟通密集", "成长看上司和客户"],
  },
  "物流 / 仓储": {
    positions: ["物流运营", "仓库管理", "国际货运事务", "配送管理", "供应链企划"],
    skills: ["WMS", "Excel", "现场管理", "多语言沟通", "成本意识"],
    products: ["国际货运", "仓储运营", "电商物流", "冷链物流"],
    remote: "现场岗位到岗，企划和事务岗位可少量远程",
    dress: "现场制服或商务休闲",
    review: ["现场节奏快", "稳定需求", "班次和繁忙期需确认"],
  },
  "酒店 / 旅游": {
    positions: ["前台接待", "客房管理", "预约运营", "旅游企划", "海外客户担当"],
    skills: ["日语接客", "英语/中文", "PMS", "投诉处理", "服务意识"],
    products: ["酒店运营", "旅行产品", "入境游服务", "地方观光"],
    remote: "现场服务为主，预约和企划可部分远程",
    dress: "制服或商务正装",
    review: ["外语有优势", "轮班较多", "服务压力需适应"],
  },
  "餐饮": {
    positions: ["店铺运营", "料理人", "区域经理", "商品开发", "海外店铺支持"],
    skills: ["接客", "卫生管理", "人员排班", "成本控制", "日语沟通"],
    products: ["连锁餐饮", "中央厨房", "外食品牌", "食品开发"],
    remote: "店铺岗位到岗，总部企划可部分远程",
    dress: "制服",
    review: ["入门机会多", "体力和排班压力较高", "晋升速度看店铺"],
  },
  "介护 / 医疗福祉": {
    positions: ["介护职员", "生活支援员", "护理助手", "设施运营", "外国人职员支援"],
    skills: ["N3-N2日语", "介护基础", "记录书写", "共情沟通", "夜勤适应"],
    products: ["养老设施", "访问介护", "障碍福祉", "康复支援"],
    remote: "现场工作为主",
    dress: "制服",
    review: ["社会需求强", "夜班和体力压力需确认", "签证路线相对明确"],
  },
  "教育 / 语言学校": {
    positions: ["日语教师", "学生募集", "生活指导", "课程运营", "海外招生"],
    skills: ["日语教育", "多语言沟通", "学生支援", "文书处理", "在留手续理解"],
    products: ["日语课程", "留学生支援", "升学指导", "企业培训"],
    remote: "授课到岗为主，招生和教材岗位可混合",
    dress: "商务休闲",
    review: ["与外国人接点多", "繁忙期集中", "制度理解很重要"],
  },
  "建筑 / 不动产": {
    positions: ["施工管理", "建筑设计", "不动产营业", "物业管理", "资产管理助理"],
    skills: ["施工图", "安全管理", "宅建", "客户协调", "日语报告"],
    products: ["住宅开发", "施工管理", "物业管理", "不动产仲介"],
    remote: "现场岗位到岗，设计和管理可少量远程",
    dress: "现场制服或商务正装",
    review: ["项目经验增长快", "现场加班风险需看公司", "资格补贴很重要"],
  },
  "零售 / 电商": {
    positions: ["店铺运营", "EC运营", "商品企划", "客服管理", "海外电商担当"],
    skills: ["电商平台", "SNS", "数据分析", "接客", "库存管理"],
    products: ["电商店铺", "生活杂货", "跨境零售", "品牌运营"],
    remote: "总部和EC岗位可混合，店铺岗位到岗",
    dress: "品牌风格或商务休闲",
    review: ["外国人顾客业务多", "销售目标压力存在", "总部岗位竞争较高"],
  },
  "金融 / 保险": {
    positions: ["法人营业", "保险顾问", "风控助理", "FinTech运营", "后台事务"],
    skills: ["金融基础", "合规", "Excel", "客户沟通", "日语文书"],
    products: ["保险代理", "资产咨询", "FinTech服务", "后台BPO"],
    remote: "后台和IT岗位可混合，客户岗位到岗较多",
    dress: "商务正装",
    review: ["合规要求高", "日语读写重要", "中小公司看经营者风格"],
  },
  "广告 / 媒体": {
    positions: ["广告运营", "内容编辑", "SNS运营", "创意策划", "客户经理"],
    skills: ["广告投放", "文案", "数据分析", "客户提案", "设计理解"],
    products: ["数字广告", "媒体运营", "内容制作", "品牌活动"],
    remote: "混合办公较多，客户活动期到岗",
    dress: "自由或商务休闲",
    review: ["年轻文化", "提案压力", "成长速度快"],
  },
  "游戏 / 动漫 / 内容产业": {
    positions: ["游戏工程师", "3D设计师", "本地化", "运营策划", "制作进行"],
    skills: ["Unity", "Unreal", "Figma", "日语文案", "作品集"],
    products: ["手游开发", "动漫制作", "IP运营", "本地化发行"],
    remote: "开发岗位可混合，制作岗位看项目",
    dress: "自由或商务休闲",
    review: ["作品导向", "发布前忙", "作品集比学历更重要"],
  },
};

const companies = [
  ["yjfx","YJFXテック","IT / 软件 / AI","东京","约180人","https://www.yjfx.jp/","2003年",8.4,3.62,true,true],
  ["abeja","ABEJA","IT / 软件 / AI","东京","约130人","https://www.abejainc.com/","2012年",8.6,3.74,true,true],
  ["preferred-networks","Preferred Networks","IT / 软件 / AI","东京","约340人","https://www.preferred.jp/","2014年",9.1,4.02,true,true],
  ["pksha","PKSHA Technology","IT / 软件 / AI","东京","约400人","https://www.pkshatech.com/","2012年",8.9,3.85,true,true],
  ["exawizards","ExaWizards","IT / 软件 / AI","东京","约470人","https://exawizards.com/","2016年",8.5,3.54,true,true],
  ["tripleize","トリプルアイズ","IT / 软件 / AI","东京","约250人","https://www.3-ize.jp/","2008年",7.5,3.21,true,true],
  ["brainpad","BrainPad","IT / 软件 / AI","东京","约590人","https://www.brainpad.co.jp/","2004年",8.0,3.58,true,true],
  ["teamspirit","チームスピリット","IT / 软件 / AI","东京","约200人","https://corp.teamspirit.com/","1996年",7.4,3.36,true,true],
  ["freee","freee","IT / 软件 / AI","东京","约1300人","https://corp.freee.co.jp/","2012年",8.2,3.76,true,true],
  ["smartnews","SmartNews","IT / 软件 / AI","东京","约900人","https://about.smartnews.com/","2012年",8.8,3.94,true,true],
  ["sakura-internet","さくらインターネット","IT / 软件 / AI","大阪","约800人","https://www.sakura.ad.jp/","1999年",7.2,3.48,true,true],
  ["rakus","ラクス","IT / 软件 / AI","东京","约2500人","https://www.rakus.co.jp/","2000年",7.1,3.42,true,false],
  ["sansan","Sansan","IT / 软件 / AI","东京","约1600人","https://jp.corp-sansan.com/","2007年",8.0,3.63,true,true],
  ["uzabase","Uzabase","IT / 软件 / AI","东京","约1100人","https://www.uzabase.com/","2008年",8.3,3.71,true,true],
  ["cybozu","サイボウズ","IT / 软件 / AI","东京","约1200人","https://cybozu.co.jp/","1997年",7.3,4.05,true,true],
  ["musashi-seimitsu","武蔵精密工業","制造业","爱知","约1200人","https://www.musashi.co.jp/","1938年",7.2,3.25,false,true],
  ["nidec-instruments","ニデックインスツルメンツ","制造业","长野","约900人","https://www.nidec.com/jp/nidec-instruments/","1946年",6.8,3.12,false,false],
  ["horiba","堀場製作所","制造业","京都","约8000人","https://www.horiba.com/jpn/","1953年",7.6,3.34,false,true],
  ["disco","ディスコ","制造业","东京","约5000人","https://www.disco.co.jp/","1937年",9.4,3.86,false,true],
  ["ulvac","アルバック","制造业","神奈川","约6000人","https://www.ulvac.co.jp/","1952年",7.5,3.18,false,true],
  ["sato","サトーホールディングス","制造业","东京","约5700人","https://www.sato-global.com/","1940年",7.0,3.08,false,true],
  ["hamamatsu-photonics","浜松ホトニクス","制造业","静冈","约6000人","https://www.hamamatsu.com/","1953年",7.1,3.39,false,true],
  ["fujimi","フジミインコーポレーテッド","制造业","爱知","约1000人","https://www.fujimiinc.co.jp/","1950年",7.2,3.28,false,false],
  ["monotaRO","MonotaRO","零售 / 电商","兵库","约1400人","https://www.monotaro.com/","2000年",7.4,3.45,true,true],
  ["askul","アスクル","零售 / 电商","东京","约3500人","https://www.askul.co.jp/kaisya/","1963年",7.2,3.38,true,false],
  ["base","BASE","零售 / 电商","东京","约280人","https://binc.jp/","2012年",7.6,3.61,true,true],
  ["stores","STORES","零售 / 电商","东京","约350人","https://www.st.inc/","2012年",7.7,3.52,true,true],
  ["kurashicom","クラシコム","零售 / 电商","东京","约100人","https://kurashi.com/","2006年",6.9,3.67,true,false],
  ["locondo","ジェイドグループ","零售 / 电商","东京","约150人","https://www.jade-group.jp/","2010年",6.8,3.12,true,false],
  ["beenos","BEENOS","零售 / 电商","东京","约450人","https://beenos.com/","1999年",7.1,3.25,true,true],
  ["tri-ad","トライアドジャパン","贸易 / 商社","东京","约120人","https://www.triad-j.co.jp/","1995年",6.5,3.02,false,true],
  ["kanematsu","兼松","贸易 / 商社","东京","约800人","https://www.kanematsu.co.jp/","1889年",8.0,3.36,false,true],
  ["inabata","稲畑産業","贸易 / 商社","大阪","约700人","https://www.inabata.co.jp/","1890年",8.3,3.31,false,true],
  ["chori","蝶理","贸易 / 商社","大阪","约400人","https://www.chori.co.jp/","1861年",8.1,3.24,false,true],
  ["nissho-electronics","日商エレクトロニクス","贸易 / 商社","东京","约1000人","https://www.nissho-ele.co.jp/","1969年",7.6,3.35,true,true],
  ["konoike","鴻池運輸","物流 / 仓储","大阪","约24000人","https://www.konoike.net/","1945年",6.3,2.96,false,true],
  ["sbs","SBSホールディングス","物流 / 仓储","东京","约23000人","https://www.sbs-group.co.jp/","1987年",6.4,2.91,false,true],
  ["az-com-maruwakai","AZ-COM丸和ホールディングス","物流 / 仓储","埼玉","约15000人","https://www.az-com-maruwa-hd.co.jp/","1973年",6.2,2.84,false,true],
  ["trancom","トランコム","物流 / 仓储","爱知","约6000人","https://www.trancom.co.jp/","1959年",6.4,2.93,false,false],
  ["souco","souco","物流 / 仓储","东京","约60人","https://www.souco.space/","2016年",6.8,3.22,true,true],
  ["hoshino-resorts","星野リゾート","酒店 / 旅游","长野","约5000人","https://www.hoshinoresorts.com/","1914年",6.7,3.45,false,true],
  ["knot-hotels","THE KNOT","酒店 / 旅游","东京","约300人","https://hotel-the-knot.jp/","2017年",6.1,3.08,false,true],
  ["tokyu-resorts","東急リゾーツ&ステイ","酒店 / 旅游","东京","约3000人","https://www.tokyu-rs.co.jp/","1979年",6.2,2.98,false,true],
  ["wondertrunk","Wondertrunk & Co.","酒店 / 旅游","东京","约80人","https://www.wondertrunk.co/","2016年",6.5,3.18,true,true],
  ["veltra","ベルトラ","酒店 / 旅游","东京","约200人","https://corp.veltra.com/","1991年",6.6,3.16,true,true],
  ["toridoll","トリドールホールディングス","餐饮","东京","约5000人","https://www.toridoll.com/","1990年",6.4,2.91,false,true],
  ["monogatari","物語コーポレーション","餐饮","爱知","约1700人","https://www.monogatari.co.jp/","1969年",6.6,3.12,false,true],
  ["create-restaurants","クリエイト・レストランツ","餐饮","东京","约4000人","https://www.createrestaurants.com/","1997年",6.1,2.82,false,true],
  ["arcland-service","アークランドサービス","餐饮","东京","约600人","https://www.arclandservice.co.jp/","1993年",6.2,2.88,false,true],
  ["eat-and","イートアンドホールディングス","餐饮","东京","约1500人","https://www.eat-and.jp/","1977年",6.2,2.86,false,true],
  ["nichii","ニチイ学館","介护 / 医疗福祉","东京","约80000人","https://www.nichiigakkan.co.jp/","1973年",5.9,2.81,false,true],
  ["saint-care","セントケア・ホールディング","介护 / 医疗福祉","东京","约10000人","https://www.saint-care.com/","1983年",6.0,2.86,false,true],
  ["tsukui","ツクイ","介护 / 医疗福祉","神奈川","约22000人","https://www.tsukui.net/","1969年",5.9,2.79,false,true],
  ["care21","ケア21","介护 / 医疗福祉","大阪","约8000人","https://www.care21.co.jp/","1993年",5.8,2.75,false,true],
  ["global-kids","グローバルキッズ","介护 / 医疗福祉","东京","约4000人","https://www.gkids.co.jp/","2006年",6.1,2.94,false,true],
  ["human-academy","ヒューマンアカデミー","教育 / 语言学校","东京","约900人","https://manabu.athuman.com/","1985年",6.2,3.02,true,true],
  ["isi","ISIグローバル","教育 / 语言学校","东京","约400人","https://www.isi-global.com/","1977年",6.4,3.18,false,true],
  ["arc-academy","アークアカデミー","教育 / 语言学校","东京","约120人","https://www.arc.ac.jp/","1986年",6.1,3.05,true,true],
  ["gaba","GABA","教育 / 语言学校","东京","约800人","https://www.gaba.co.jp/","1995年",6.0,2.92,true,true],
  ["rarejob","レアジョブ","教育 / 语言学校","东京","约200人","https://www.rarejob.co.jp/","2007年",6.7,3.24,true,true],
  ["open-house","オープンハウスグループ","建筑 / 不动产","东京","约5000人","https://openhouse-group.co.jp/","1997年",7.4,3.05,false,true],
  ["property-agent","プロパティエージェント","建筑 / 不动产","东京","约200人","https://www.propertyagent.co.jp/","2004年",6.8,3.13,false,false],
  ["global-link","グローバル・リンク・マネジメント","建筑 / 不动产","东京","约150人","https://www.global-link-m.com/","2005年",6.8,3.09,false,false],
  ["mugen-estate","ムゲンエステート","建筑 / 不动产","东京","约300人","https://www.mugen-estate.co.jp/","1990年",6.7,3.02,false,false],
  ["gooddays","グッドルーム","建筑 / 不动产","东京","约250人","https://www.gooddays.jp/","2012年",6.5,3.32,true,true],
  ["lifull","LIFULL","建筑 / 不动产","东京","约1500人","https://lifull.com/","1997年",7.0,3.58,true,true],
  ["justincase","justInCase","金融 / 保险","东京","约100人","https://justincase.jp/","2016年",7.0,3.34,true,true],
  ["wealthnavi","ウェルスナビ","金融 / 保险","东京","约250人","https://corp.wealthnavi.com/","2015年",7.6,3.44,true,true],
  ["money-forward","マネーフォワード","金融 / 保险","东京","约2000人","https://corp.moneyforward.com/","2012年",8.0,3.72,true,true],
  ["hokan","hokan","金融 / 保险","东京","约90人","https://hkn.jp/","2017年",7.0,3.28,true,true],
  ["microad","マイクロアド","广告 / 媒体","东京","约400人","https://www.microad.co.jp/","2007年",6.8,3.18,true,true],
  ["freakout","フリークアウト","广告 / 媒体","东京","约450人","https://www.fout.co.jp/","2010年",7.0,3.32,true,true],
  ["septeni","セプテーニ","广告 / 媒体","东京","约1600人","https://www.septeni-holdings.co.jp/","1990年",6.9,3.25,true,true],
  ["cyberbuzz","サイバー・バズ","广告 / 媒体","东京","约200人","https://www.cyberbuzz.co.jp/","2006年",6.6,3.09,true,false],
  ["note","note","广告 / 媒体","东京","约250人","https://note.jp/","2011年",7.2,3.64,true,true],
  ["akatsuki","アカツキゲームス","游戏 / 动漫 / 内容产业","东京","约500人","https://aktsk-games.com/","2010年",7.0,3.36,true,true],
  ["colopl","コロプラ","游戏 / 动漫 / 内容产业","东京","约800人","https://colopl.co.jp/","2008年",6.9,3.18,true,true],
  ["gumi","gumi","游戏 / 动漫 / 内容产业","东京","约800人","https://gu3.co.jp/","2007年",6.7,3.03,true,true],
  ["klab","KLab","游戏 / 动漫 / 内容产业","东京","约600人","https://www.klab.com/","2000年",6.6,3.02,true,true],
  ["toei-animation","東映アニメーション","游戏 / 动漫 / 内容产业","东京","约900人","https://corp.toei-anim.co.jp/","1948年",7.1,3.29,false,true],
  ["khara","カラー","游戏 / 动漫 / 内容产业","东京","约100人","https://www.khara.co.jp/","2006年",6.8,3.38,false,false],
  ["dwango","ドワンゴ","游戏 / 动漫 / 内容产业","东京","约1000人","https://dwango.co.jp/","1997年",6.9,3.28,true,true],
  ["mixi","MIXI","游戏 / 动漫 / 内容产业","东京","约1600人","https://mixi.co.jp/","1999年",7.4,3.56,true,true],
  ["gmo-pepabo","GMOペパボ","IT / 软件 / AI","东京","约500人","https://pepabo.com/","2003年",7.0,3.50,true,true],
  ["hatena","はてな","IT / 软件 / AI","京都","约200人","https://hatenacorp.jp/","2001年",6.9,3.42,true,true],
  ["m3-career","エムスリーキャリア","医疗 / 人材","东京","约800人","https://www.m3career.com/","2009年",7.4,3.40,true,true],
  ["medley","メドレー","医疗 / 人材","东京","约1000人","https://www.medley.jp/","2009年",7.6,3.53,true,true],
  ["sms","エス・エム・エス","医疗 / 人材","东京","约4000人","https://www.bm-sms.co.jp/","2003年",7.5,3.44,true,true],
  ["visional","ビズリーチ / Visional","人材 / 平台","东京","约2000人","https://www.visional.inc/","2020年",8.0,3.70,true,true],
  ["wantedly","Wantedly","人材 / 平台","东京","约150人","https://wantedlyinc.com/","2010年",6.9,3.46,true,true],
  ["lapras","LAPRAS","人材 / 平台","东京","约70人","https://corp.lapras.com/","2016年",6.8,3.41,true,true],
  ["uzuz","UZUZ","人材 / 平台","东京","约150人","https://uzuz.jp/","2012年",6.5,3.20,true,true],
  ["paiza","paiza","人材 / 平台","东京","约120人","https://paiza.co.jp/","2012年",6.8,3.38,true,true],
  ["dip","ディップ","人材 / 平台","东京","约3000人","https://www.dip-net.co.jp/","1997年",7.0,3.20,true,true],
  ["en-japan","エン・ジャパン","人材 / 平台","东京","约3000人","https://corp.en-japan.com/","2000年",6.8,3.14,true,true],
  ["cookpad","クックパッド","IT / 软件 / AI","神奈川","约500人","https://info.cookpad.com/","1997年",7.0,3.49,true,true],
  ["kakehashi","カケハシ","IT / 软件 / AI","东京","约300人","https://www.kakehashi.life/","2016年",7.4,3.57,true,true],
  ["ubie","Ubie","IT / 软件 / AI","东京","约300人","https://ubie.life/","2017年",7.8,3.76,true,true],
  ["legalon","LegalOn Technologies","IT / 软件 / AI","东京","约500人","https://legalontech.jp/","2017年",7.6,3.65,true,true],
  ["layerx","LayerX","IT / 软件 / AI","东京","约400人","https://layerx.co.jp/","2018年",7.9,3.78,true,true],
  ["helpfeel","Helpfeel","IT / 软件 / AI","京都","约120人","https://corp.helpfeel.com/","2007年",7.3,3.55,true,true],
  ["autify","Autify","IT / 软件 / AI","东京","约100人","https://autify.com/","2016年",7.4,3.48,true,true],
  ["findy","ファインディ","人材 / 平台","东京","约190人","https://findy.co.jp/","2016年",7.2,3.44,true,true],
  ["herp","HERP","人材 / 平台","东京","约80人","https://herp.co.jp/","2017年",7.1,3.39,true,true],
  ["shippio","Shippio","物流 / 仓储","东京","约80人","https://www.shippio.io/","2016年",7.0,3.30,true,true],
  ["hacomono","hacomono","IT / 软件 / AI","东京","约220人","https://www.hacomono.jp/","2013年",7.1,3.36,true,true],
  ["commmune","コミューン","IT / 软件 / AI","东京","约150人","https://commmune.jp/","2018年",7.0,3.32,true,true],
  ["overflow","overflow","IT / 软件 / AI","东京","约70人","https://overflow.co.jp/","2017年",6.9,3.30,true,true],
  ["yappli","ヤプリ","IT / 软件 / AI","东京","约250人","https://yappli.co.jp/","2013年",7.0,3.31,true,true],
  ["repro","Repro","广告 / 媒体","东京","约120人","https://repro.io/","2014年",6.8,3.20,true,true],
  ["sprocket","Sprocket","广告 / 媒体","东京","约80人","https://www.sprocket.bz/","2014年",6.6,3.14,true,false],
  ["smartround","スマートラウンド","金融 / 保险","东京","约80人","https://jp.smartround.com/","2018年",6.9,3.24,true,true],
  ["kanmu","カンム","金融 / 保险","东京","约70人","https://kanmu.co.jp/","2011年",7.2,3.30,true,true],
  ["finatext","Finatext","金融 / 保险","东京","约250人","https://finatext.com/","2013年",7.5,3.40,true,true],
  ["fabric-tokyo","FABRIC TOKYO","零售 / 电商","东京","约100人","https://fabric-tokyo.com/","2012年",6.4,3.08,true,true],
  ["kokopelli","ココペリ","金融 / 保险","东京","约100人","https://www.kokopelli-inc.com/","2007年",6.6,3.10,true,false],
  ["tsukuruba","ツクルバ","建筑 / 不动产","东京","约230人","https://tsukuruba.com/","2011年",6.7,3.22,true,true],
  ["renoveru","リノべる","建筑 / 不动产","东京","约250人","https://www.renoveru.co.jp/","2010年",6.6,3.18,true,false],
  ["visasq","ビザスク","人材 / 平台","东京","约250人","https://visasq.co.jp/","2012年",7.0,3.36,true,true],
  ["coconala","ココナラ","人材 / 平台","东京","约200人","https://coconala.co.jp/","2012年",6.8,3.24,true,true],
  ["anymind","AnyMind Japan","广告 / 媒体","东京","约300人","https://anymindgroup.com/","2016年",6.9,3.18,true,true],
  ["wakuwaku","和久環組","建筑 / 不动产","神奈川","约80人","https://wakuwaku0909.co.jp/","2013年",6.2,3.05,false,false],
  ["unito","Unito","酒店 / 旅游","东京","约60人","https://unito.life/","2017年",6.2,3.10,true,true],
  ["kabuk-style","KabuK Style","酒店 / 旅游","长崎","约100人","https://kabuk.com/","2019年",6.3,3.12,true,true],
  ["tablecross","テーブルクロス","餐饮","东京","约50人","https://tablecross.com/","2014年",5.9,2.95,true,true],
  ["cookbiz","クックビズ","餐饮","大阪","约200人","https://cookbiz.co.jp/","2007年",6.1,3.02,true,true],
  ["kidsline","キッズライン","介护 / 医疗福祉","东京","约80人","https://kidsline.me/","2014年",6.0,3.00,true,true],
  ["global-crown","GLOBAL CROWN","教育 / 语言学校","东京","约60人","https://www.global-crown.com/","2015年",6.2,3.12,true,true],
  ["spiber","Spiber","制造业","山形","约300人","https://spiber.inc/","2007年",7.0,3.35,false,true],
  ["mui-lab","mui Lab","制造业","京都","约50人","https://mui.jp/","2017年",6.4,3.18,true,true],
];

const regionOf = (location) => {
  if (["东京", "神奈川", "埼玉", "千叶"].includes(location)) return "关东";
  if (["大阪", "京都", "兵库"].includes(location)) return "关西";
  if (["爱知", "静冈", "长野"].includes(location)) return "中部";
  if (["山形", "宫城", "福岛"].includes(location)) return "东北";
  if (["福冈", "长崎", "熊本", "鹿儿岛"].includes(location)) return "九州";
  return "其他地区";
};

const salaryBandOf = (score) => {
  if (score >= 8.5) return "800万日元以上";
  if (score >= 7.4) return "600万-800万日元";
  if (score >= 6.5) return "400万-600万日元";
  return "400万日元以下";
};

const salaryValueOf = (score) => {
  if (score >= 8.5) return 9;
  if (score >= 7.4) return 7.6;
  if (score >= 6.5) return 6.3;
  return 4.8;
};

const employeeBandOf = (text) => {
  const n = Number((text.match(/\d+/)?.[0] ?? "0"));
  if (n < 100) return "100人以下";
  if (n < 300) return "100-300人";
  if (n < 1000) return "300-1000人";
  return "1000人以上";
};

const japaneseOf = (industry, foreign) => {
  if (industry.includes("介护")) return "N3-N2";
  if (industry.includes("IT") && foreign) return "N2";
  if (industry.includes("酒店") || industry.includes("餐饮")) return "N3-N2";
  return "N2-N1";
};

const generalInterviewQuestions = [
  "请用日语做一分钟自我介绍。",
  "为什么想在日本长期工作？",
  "为什么从众多企业中选择我们公司？",
  "你过去最有成就感的一次工作或项目是什么？",
  "遇到意见不合时，你通常如何沟通？",
  "你希望三年后在日本职场达到什么状态？",
  "你对加班、转勤或现场支援的接受范围是什么？",
  "你离职或换工作的主要原因是什么？",
  "你认为自己和日本团队合作时最大的优势是什么？",
  "你还有什么想向公司确认的问题？",
];

const foreignerInterviewQuestions = [
  "你的在留资格、签证期限和更新计划是什么？",
  "如果客户或上司使用很快的日语说明需求，你会如何确认理解？",
  "你在日本生活或打工中遇到文化差异时是怎么处理的？",
  "你能接受只用日语写日报、邮件和业务记录吗？",
  "你希望公司在哪些方面提供外国人入职支持？",
];

const industryInterviewQuestions = {
  "IT / 软件 / AI": [
    "请说明一个你实际参与过的系统设计或开发项目。",
    "遇到线上故障或性能问题时，你会怎样定位原因？",
    "你如何在速度、质量和安全性之间做取舍？",
    "请介绍你最近学习的一项技术，以及为什么学习它。",
    "如果产品经理的需求不清楚，你会怎样推进确认？",
  ],
  "制造业": [
    "你如何理解品质、成本、交期之间的平衡？",
    "请说明你接触过的制造现场、设备或改善活动。",
    "如果现场作业者和设计部门意见不同，你会如何协调？",
    "你是否能接受工厂据点、出差或现场研修？",
    "你如何记录并报告不良原因和改善结果？",
  ],
  "贸易 / 商社": [
    "你如何处理客户、供应商和物流方之间的交涉？",
    "请说明你对贸易流程或进出口业务的理解。",
    "如果交期延迟，你会按什么顺序沟通和补救？",
    "你能否用日语或外语进行商务邮件和报价沟通？",
    "你希望负责国内客户、海外客户还是采购业务？",
  ],
  "物流 / 仓储": [
    "你如何看待安全、效率和成本之间的优先顺序？",
    "如果仓库现场出现误出货，你会怎样处理？",
    "你是否能适应早晚班、繁忙期和现场沟通？",
    "请说明你使用 Excel、WMS 或库存管理工具的经验。",
    "你如何和司机、仓库人员、客户同时协调信息？",
  ],
  "酒店 / 旅游": [
    "遇到客诉时，你会怎样用日语或外语安抚客人？",
    "你为什么选择酒店或旅游服务行业？",
    "你是否能适应轮班、周末出勤和旺季排班？",
    "请举例说明你提供过的一次好服务。",
    "你如何向外国游客介绍日本本地文化或服务规则？",
  ],
  "餐饮": [
    "你如何应对高峰期店铺忙乱和顾客等待？",
    "你是否能接受站立工作、排班和节假日出勤？",
    "请说明你对卫生管理和食品安全的理解。",
    "如果新人反复出错，你会怎样指导？",
    "你未来想走店长、区域经理还是商品开发路线？",
  ],
  "介护 / 医疗福祉": [
    "你为什么选择介护或医疗福祉行业？",
    "面对认知症或情绪不稳定的利用者，你会如何沟通？",
    "你是否能接受夜勤、身体介助和记录书写？",
    "你如何保护利用者尊严和个人信息？",
    "你未来是否计划取得介护福祉士等资格？",
  ],
  "教育 / 语言学校": [
    "你如何支持学习进度不同的学生？",
    "如果学生迟到、缺席或生活上遇到困难，你会怎么处理？",
    "你如何看待教育服务中的规则和关怀之间的平衡？",
    "你是否有课程设计、学生支援或招生经验？",
    "面对多国籍学生时，你会如何避免沟通误解？",
  ],
  "建筑 / 不动产": [
    "你如何处理客户需求、现场条件和预算之间的矛盾？",
    "你是否能接受外勤、现场确认或施工进度压力？",
    "如果客户提出不合理要求，你会如何说明和调整？",
    "你对宅建、施工管理或建筑相关资格有什么计划？",
    "你如何保证报告、合同或图纸确认不出错？",
  ],
  "零售 / 电商": [
    "你如何通过数据判断商品、库存或促销效果？",
    "如果顾客评价下降，你会先确认哪些信息？",
    "你是否有电商平台、SNS 或客服运营经验？",
    "你如何理解品牌调性和销售目标之间的关系？",
    "面对海外顾客咨询，你会怎样推进购买和售后？",
  ],
  "金融 / 保险": [
    "你如何理解金融行业中的合规和客户信任？",
    "如果客户只关注收益而忽视风险，你会如何说明？",
    "你是否能适应细致的文书、确认和审批流程？",
    "你对保险、资产管理或 FinTech 产品有什么理解？",
    "你如何处理个人信息和敏感数据？",
  ],
  "广告 / 媒体": [
    "请介绍一次你做过的内容、广告或 SNS 运营经验。",
    "如果广告效果不好，你会从哪些指标开始分析？",
    "你如何面对客户反复修改或紧急需求？",
    "你认为好的创意和商业结果如何平衡？",
    "你最近关注的日本媒体、品牌或营销案例是什么？",
  ],
  "游戏 / 动漫 / 内容产业": [
    "请介绍你的作品集、参与项目或最熟悉的内容类型。",
    "你如何看待品质、工期和创意之间的冲突？",
    "发布前或上线前的高强度时期你如何管理节奏？",
    "你喜欢的日本游戏、动画或 IP 是什么，理由是什么？",
    "你如何接受制作人、导演或用户反馈并修改成果？",
  ],
  "医疗 / 人材": [
    "你如何理解医疗或人材业务中的个人信息保护？",
    "如果候选人和企业双方期待不一致，你会如何协调？",
    "你为什么想做医疗、人材或职业支援相关工作？",
    "你如何建立客户或候选人的长期信任？",
    "你能否接受电话、面谈和目标管理并行的工作方式？",
  ],
  "人材 / 平台": [
    "你如何理解候选人体验和企业招聘效率之间的平衡？",
    "请说明你对日本求职市场或招聘媒体的观察。",
    "如果用户流失或转化率下降，你会如何分析？",
    "你是否能接受目标数字、客户沟通和快速改善？",
    "你希望做客户成功、运营、产品还是销售方向？",
  ],
};

const pickCyclic = (items, start, count) =>
  Array.from({ length: count }, (_, i) => items[(start + i) % items.length]);

const clampScore = (value) => Math.min(10, Math.max(1, Math.round(value * 10) / 10));

const scoreBreakdownOf = ({ industry, salaryScore, openworkScore, remote, foreign, visa, overtime, shift }) => {
  const salary = salaryValueOf(salaryScore);
  const stabilityBase = industry.includes("制造") || industry.includes("物流") || industry.includes("介护") ? 7.6 : industry.includes("IT") || industry.includes("游戏") ? 6.6 : 6.9;
  const stability = clampScore(stabilityBase + Math.min(1, openworkScore - 3) - (overtime > 25 ? 0.6 : 0));
  const growth = clampScore((industry.includes("IT") || industry.includes("AI") || industry.includes("广告") || industry.includes("游戏") ? 8 : 6.8) + salaryScore / 10 + (remote ? 0.3 : 0));
  const workLifeBalance = clampScore(8.8 - overtime / 10 + (remote ? 0.8 : 0) - (shift ? 0.6 : 0));
  const foreignerFriendliness = clampScore(foreign ? (visa ? 8.3 : 7.2) : 4.2);
  const businessValue = clampScore((industry.includes("IT") || industry.includes("制造") || industry.includes("金融") ? 7.8 : 6.8) + salaryScore / 12);
  const employeeReviews = clampScore(openworkScore * 2);
  const total = clampScore(
    salary * 0.15 +
      stability * 0.15 +
      growth * 0.15 +
      workLifeBalance * 0.15 +
      foreignerFriendliness * 0.2 +
      businessValue * 0.1 +
      employeeReviews * 0.1,
  );
  return { salary, stability, growth, workLifeBalance, foreignerFriendliness, businessValue, employeeReviews, total };
};

const languageFitOf = (japaneseLevel, industry, foreign) => {
  if (japaneseLevel.includes("N3")) return { tag: "N3可挑战", suitableForLowJapanese: true, proofRisk: "中：建议准备JLPT、BJT、学校证明或同等日语能力说明" };
  if (japaneseLevel === "N2") return { tag: "N2推荐", suitableForLowJapanese: false, proofRisk: foreign ? "中：工签和业务沟通不只看N2，需准备日语证明和岗位适配说明" : "中高：日语和日本职场经验需重点证明" };
  if (industry.includes("IT") && foreign) return { tag: "需英语环境确认", suitableForLowJapanese: false, proofRisk: "中：若以英语工作，需要确认团队语言、客户沟通和签证材料说明" };
  return { tag: "N4不建议", suitableForLowJapanese: false, proofRisk: "高：日语证明、客户沟通和面试通过率风险较高" };
};

const suitabilityOf = (industry, foreign, remote, overtime, salaryScore, index, japaneseLevel) => {
  const languageFit = languageFitOf(japaneseLevel, industry, foreign);
  const suitableForNewGrad = index % 3 !== 2 || industry.includes("餐饮") || industry.includes("介护") || industry.includes("物流");
  const suitableForCareerChange = salaryScore >= 6.5 || industry.includes("IT") || industry.includes("商社") || industry.includes("人材");
  const matchTags = [
    foreign ? "外国人友好" : "外国人案例少",
    suitableForNewGrad ? "适合新卒" : "新卒少量",
    suitableForCareerChange ? "适合转职" : "转职需经验",
    languageFit.tag,
    remote ? "远程/混合" : "到岗为主",
    overtime <= 20 ? "低加班" : overtime <= 25 ? "中等加班" : "加班需确认",
    salaryScore >= 7.4 ? "薪资较好" : "薪资普通",
  ];
  return { suitableForNewGrad, suitableForCareerChange, suitableForLowJapanese: languageFit.suitableForLowJapanese, languageProofRisk: languageFit.proofRisk, matchTags };
};

const riskTagsOf = (industry, foreign, visa, overtime, salaryScore, shift) => [
  ...(overtime > 25 ? ["加班风险"] : []),
  ...(shift ? ["轮班风险"] : []),
  ...(salaryScore < 6.5 ? ["薪资偏低"] : []),
  ...(!foreign ? ["外国人适配风险"] : []),
  ...(foreign && !visa ? ["签证需确认"] : []),
  ...(industry.includes("餐饮") || industry.includes("介护") ? ["离职率需确认"] : []),
];

const decisionTextOf = ({ name, industry, foreign, visa, remote, overtime, japaneseLevel, score }) => {
  const target = foreign ? "外国人求职者" : "已有日本职场经验或日语较强的求职者";
  const style = remote ? "希望混合办公和自走空间" : "能接受到岗、现场协作或排班";
  return `${name}更适合${target}，尤其是${style}、日语约${japaneseLevel}、能接受月${overtime}小时左右加班的人。综合评分 ${score}/10，投递前应重点确认签证支持、评价制度和实际加班。`;
};

const specialCompanyOverrides = {
  "preferred-networks": {
    employees: "约350人",
    mainBusiness: "AI半导体、计算基盘、生成AI基盤模型、AI产品/解决方案的垂直整合开发与社会实装",
    mainProducts: ["AI半导体", "计算基盘", "生成AI基盤模型", "AI产品/解决方案"],
    requiredSkills: ["机器学习", "深度学习", "Python/C++", "分布式计算", "LLM/生成AI", "论文阅读与研究实现"],
    suitableForLowJapanese: false,
    matchTags: ["外国人友好", "挑战企业", "N2推荐", "需英语环境确认", "远程/混合", "技术门槛高", "薪资较好"],
    riskTags: ["技术面试难", "竞争激烈", "研究/算法门槛高"],
    languageProofRisk: "中：岗位可能有英语环境，但客户/团队协作、签证材料和日本语沟通仍需确认；JLPT N2、BJT或同等证明更稳妥。",
    decisionSummary: "Preferred Networks属于挑战型AI头部企业。优势是AI半导体、计算基盘、生成AI基盤模型和AI产品/解决方案的垂直整合，技术含金量很高；但对算法、研究实现、工程能力和面试表现要求明显高于一般IT企业，建议按6-12个月准备。",
    aiSummary: "PFN不是普通受托开发或SaaS公司。官方业务强调AI半导体、计算基盘、生成AI基盤模型、AI产品/解决方案四层技术的自研与垂直整合。外国人可以研究，但不宜被标成低日语轻松可投；更适合作为技术挑战目标。",
    recommendationReason: "适合有强算法/机器学习/工程实现能力、能准备英文或日文技术面试、希望进入日本AI核心技术企业的人。",
    interviewInfo: {
      difficulty: "高",
      japaneseInterviewDifficulty: "中高",
      foreignerInterviewDifficulty: "高：需证明技术深度、沟通语言和长期在日工作可行性",
      codingTest: "高度可能有算法/机器学习/系统设计/研究实现相关测试或深度技术问答",
    },
    riskAnalysis: {
      foreignerFitRisk: "中：团队国际化可能性较高，但岗位语言、签证材料和日本语协作需逐项确认",
      notes: ["官方业务强调AI半导体、计算基盘、生成AI基盤模型、AI产品/解决方案四层垂直整合", "技术面试和研究实现门槛高，建议准备6-12个月"],
    },
    suitedFor: ["机器学习、算法、分布式系统或高性能计算基础较强的人", "能阅读论文并把研究转成工程实现的人", "愿意把PFN作为挑战目标长期准备的人"],
    notSuitedFor: ["只想找普通Web开发入门岗位的人", "没有作品集、研究经历或高质量项目经验的人", "日语/英语技术表达都不稳定的人"],
    dataSourceNote: "员工数约350人为招聘/公开资料口径；业务描述参考PFN官网2026年6月页面，字段为求职研究用摘要。",
    sourceUrls: ["https://www.preferred.jp/ja/", "https://www.preferred.jp/ja/business", "https://www.preferred.jp/ja/company", "https://www.preferred.jp/ja/careers"],
  },
  abeja: {
    employees: "133名（2025年8月末时点）",
    mainBusiness: "数字平台业务、ABEJA Platform、ABEJA LLM Series、AI伦理咨询、DX人材育成、Insight for Retail",
    mainProducts: ["ABEJA Platform", "ABEJA LLM Series", "AI伦理咨询", "DX人材育成", "Insight for Retail"],
    requiredSkills: ["Python", "机器学习", "云服务", "数据分析", "LLM应用", "客户课题理解"],
    suitableForLowJapanese: false,
    matchTags: ["小企业", "外国人友好", "适合新卒", "适合转职", "N2推荐", "远程/混合", "AI/DX", "薪资较好"],
    riskTags: ["客户课题理解要求高", "项目变化快"],
    languageProofRisk: "中：AI/DX项目通常需要客户课题理解和日语沟通，N2更稳；N3只能作为挑战，需确认岗位语言环境。",
    decisionSummary: "ABEJA适合想进入AI/DX社会实装方向、具备N2左右日语和数据/云/机器学习基础的人。相比PFN更偏业务落地和客户课题解决，但仍不应按低日语轻松岗位理解。",
    aiSummary: "ABEJA官网强调数字平台、ABEJA Platform、ABEJA LLM Series、AI伦理咨询、DX人材育成和零售洞察等业务。它适合AI/DX落地型求职者，关键风险是客户沟通、项目变化和日语业务理解。",
    recommendationReason: "适合希望进入AI/DX项目、能把技术和客户业务问题连接起来的人。",
    dataSourceNote: "员工数133名为ABEJA公司页面2025年8月末时点口径；业务描述参考ABEJA官网公司/业务页面，字段为求职研究用摘要。",
    sourceUrls: ["https://www.abejainc.com/company", "https://www.abejainc.com/"],
  },
};

const mergeCompanyOverride = (company) => {
  const override = specialCompanyOverrides[company.slug];
  if (!override) return company;
  return {
    ...company,
    ...override,
    interviewInfo: { ...company.interviewInfo, ...(override.interviewInfo ?? {}) },
    riskAnalysis: { ...company.riskAnalysis, ...(override.riskAnalysis ?? {}) },
  };
};

const interviewQuestionsOf = (industry, name, p, foreign, index) => {
  const industryQuestions = industryInterviewQuestions[industry] ?? industryInterviewQuestions["IT / 软件 / AI"];
  const role = p.positions[index % p.positions.length];
  const skill = p.skills[(index + 2) % p.skills.length];
  const product = p.products[(index + 1) % p.products.length];
  const questions = [
    generalInterviewQuestions[index % generalInterviewQuestions.length],
    `你为什么对${name}的${product}业务感兴趣？`,
    ...pickCyclic(industryQuestions, index, 2),
    `如果入职后负责${role}，你会如何运用${skill}经验？`,
  ];

  if (foreign) {
    questions.push(foreignerInterviewQuestions[index % foreignerInterviewQuestions.length]);
  } else {
    questions.push("如果公司目前外国籍员工较少，你会如何证明自己能顺利融入团队？");
  }

  return questions;
};

const toCompany = ([slug, name, industry, location, employees, website, founded, salaryScore, openworkScore, remote, foreign], index) => {
  const p = industries[industry] ?? industries["IT / 软件 / AI"];
  const employeeBand = employeeBandOf(employees);
  const overtime = industry.includes("餐饮") || industry.includes("介护") || industry.includes("建筑") ? 28 : remote ? 18 : 22;
  const visa = foreign && !industry.includes("金融");
  const shift = industry.includes("酒店") || industry.includes("餐饮") || industry.includes("介护") || industry.includes("物流");
  const night = industry.includes("介护") || industry.includes("酒店") || industry.includes("物流");
  const scoreBreakdown = scoreBreakdownOf({ industry, salaryScore, openworkScore, remote, foreign, visa, overtime, shift });
  const rec = scoreBreakdown.total;
  const japaneseLevel = japaneseOf(industry, foreign);
  const suitability = suitabilityOf(industry, foreign, remote, overtime, salaryScore, index, japaneseLevel);
  const sizeTags = employeeBand === "100人以下" ? ["超小团队"] : employeeBand === "100-300人" ? ["小企业"] : [];
  const riskTags = riskTagsOf(industry, foreign, visa, overtime, salaryScore, shift);
  const recommendationReason = `${p.products[0]}或${p.positions[0]}相关岗位能积累实务经验；${foreign ? "外国人录用可能性较高" : "外国人案例较少但可作为挑战候选"}，${remote ? "工作方式较灵活" : "现场协作多"}，适合重视${scoreBreakdown.growth >= scoreBreakdown.stability ? "成长性" : "稳定性"}的人。`;
  const decisionSummary = decisionTextOf({ name, industry, foreign, visa, remote, overtime, japaneseLevel, score: rec });
  const aiSummary = `${name}不是单纯看公司规模就能判断的企业。它的优势在于${p.review[0]}和${p.products[0]}经验，风险在于${riskTags.length ? riskTags.join("、") : "制度执行仍需面试确认"}。如果你需要${visa ? "签证支持" : "稳定的签证说明"}、希望在${industry}积累日本经验，可以放入候选；面试时建议追问固定残业、配属、评价制度和外国员工案例。`;
  return {
    slug,
    name,
    industry,
    location: `${location}都道府县中心区域`,
    region: regionOf(location),
    employees,
    employeeBand,
    website,
    founded,
    founderBackground: "创业者或经营团队多来自相关行业、技术开发、营业企划或本地服务领域；MVP阶段建议面试前查看公司沿革和役员资料。",
    mainBusiness: p.products.join("、"),
    mainProducts: p.products,
    hiringPositions: p.positions,
    requiredSkills: p.skills,
    japaneseLevel,
    educationRequirement: industry.includes("制造") ? "理工岗位重视专业背景，综合职看岗位匹配" : "多数岗位本科或同等经验可，实务经验和作品集可弥补学历",
    visaSupport: visa,
    acceptsForeigners: foreign,
    foreignEmployeeCases: foreign ? "公开招聘信息和求职口碑中可见外国籍或双语人才录用案例，具体需面试确认。" : "公开信息中外国籍案例较少，建议投递前询问签证和语言支持。",
    hiringType: index % 3 === 0 ? "新卒和中途均有" : index % 3 === 1 ? "中途为主，新卒少量" : "岗位型中途採用为主",
    workHours: shift ? "轮班或弹性排班，月度排班制" : "标准工作时间约9:00-18:00，部分岗位弹性",
    restSystem: shift ? "月休8-10日，按排班取得休假" : "完全周休二日制，节假日、年末年始、有给休假",
    shiftWork: shift,
    nightShift: night,
    remoteWork: p.remote,
    remoteAvailable: remote,
    flexibleWork: remote || industry.includes("广告") || industry.includes("游戏"),
    hybridWork: remote,
    overtime: `月均约${overtime}小时；项目、店铺、现场和繁忙期会波动`,
    overtimeHours: overtime,
    salaryRange: salaryBandOf(salaryScore),
    salaryBand: salaryBandOf(salaryScore),
    newGradSalary: salaryScore >= 7.5 ? "月给约25万-32万日元" : "月给约21万-27万日元",
    midCareerSalary: salaryScore >= 8 ? "年收约600万-1000万日元，按经验浮动" : salaryScore >= 7 ? "年收约450万-750万日元，按经验浮动" : "年收约320万-600万日元，按经验浮动",
    bonus: index % 4 === 0 ? "年2次奖金或业绩连动奖金" : "按公司业绩和个人评价支付",
    raiseSystem: "年度评价调薪，部分公司采用等级制或目标管理制度",
    benefits: ["社会保险", "交通费", "有给休假", "育儿护理制度", remote ? "远程办公补贴" : "资格取得支援"],
    transportAllowance: "原则实费或上限支付",
    housingAllowance: index % 5 === 0 ? "有住宅补贴或搬家支援" : "公开信息有限，需确认",
    sideJob: remote || industry.includes("广告") ? "申报制可副业的可能性较高" : "多数需公司许可",
    dressCode: p.dress,
    openworkScore,
    foreignerFriendlyScore: foreign ? (visa ? 8 : 7) : 4,
    recommendationScore: rec,
    scoreBreakdown,
    matchTags: [...sizeTags, ...suitability.matchTags],
    riskTags,
    suitableForNewGrad: suitability.suitableForNewGrad,
    suitableForCareerChange: suitability.suitableForCareerChange,
    suitableForLowJapanese: suitability.suitableForLowJapanese,
    languageProofRisk: suitability.languageProofRisk,
    dataSourceNote: "MVP估算数据：公开官网、招聘页面、公开评价摘要和企业公开资料整理；员工数、薪资、评价等字段需以投递时官网/募集要项为准。",
    sourceUrls: [website],
    decisionSummary,
    aiSummary,
    recommendationReason,
    reviewSummary: {
      pros: [p.review[0], "中小企业中接触业务范围较广", "成长机会取决于项目和上司"],
      cons: [p.review[1], "制度成熟度可能不如大企业", "评价和配属透明度需面试确认"],
      keywords: p.review,
      atmosphere: remote ? "相对扁平，线上协作较多，重视自走能力。" : "现场和团队协作较多，沟通密度较高。",
      managementStyle: "经营层距离较近，速度快；同时公司差异大，需要通过OB/OG和面试确认。",
      overtimeReview: `公开评价常见说法为月${overtime}小时上下，繁忙期上升。`,
      growthOpportunity: "能较早接触客户、项目或现场问题，适合主动学习者。",
      leavingReasons: ["薪资涨幅有限", "业务或现场压力", "制度不够标准化"],
      sources: {
        openWork: "公开评价摘要口径，需登录平台确认原文",
        tenshokuKaigi: "公开评价摘要口径，需登录平台确认原文",
        glassdoor: "外资/英文评价较少，仅作补充",
        wantedly: "用于了解文化、成员访谈和招聘叙事",
        googleMaps: "用于确认门店/服务业客户评价趋势",
      },
    },
    interviewInfo: {
      rounds: index % 2 === 0 ? "书类筛选 → 一次面试 → 最终面试" : "书类筛选 → Web面谈 → 职种面试 → 最终面试",
      questions: interviewQuestionsOf(industry, name, p, foreign, index),
      writtenTest: industry.includes("IT") ? "SPI或简单适性检查；部分公司无笔试" : "SPI、适性检查或企业自编基础题",
      codingTest: industry.includes("IT") || industry.includes("游戏") ? "可能有编码测试、GitHub/作品集审查或技术问答" : "通常无编码测试",
      japaneseInterviewDifficulty: japaneseOf(industry, foreign).includes("N1") ? "中高" : "中",
      foreignerInterviewDifficulty: foreign ? "中：重点确认签证、日语、长期工作意愿" : "中高：需主动确认签证支持和外国人录用经验",
      difficulty: rec >= 8 ? "中高" : rec >= 6.5 ? "中" : "低中",
    },
    riskAnalysis: {
      blackCompanyRisk: overtime > 25 ? "中：需确认固定残业、离职率和休假取得" : "低中：仍需确认制度执行情况",
      overtimeRisk: overtime > 25 ? "中高" : overtime > 20 ? "中" : "低中",
      turnoverRisk: industry.includes("餐饮") || industry.includes("介护") ? "中高" : "中",
      lowSalaryRisk: salaryScore < 6.5 ? "中高" : "中",
      foreignerFitRisk: foreign ? "低中：语言和文化适应仍是关键" : "中高：签证支持和受入经验需提前确认",
      notes: ["MVP数据为公开资料和求职口碑整合，不替代正式尽调", "投递前建议确认固定残业、试用期、转勤、签证支持"],
    },
    suitedFor: ["想在中小企业快速获得实务经验的人", "能主动确认制度和工作边界的人", "希望积累日本职场沟通经验的外国人"],
    notSuitedFor: ["强依赖完善培训制度的人", "完全不能接受制度不确定性的人", "对加班、轮班或日语沟通压力零容忍的人"],
    updatedAt: "2026-06-22",
  };
};

for (const company of companies.map(toCompany).map(mergeCompanyOverride)) {
  fs.writeFileSync(path.join(outDir, `${company.slug}.json`), `${JSON.stringify(company, null, 2)}\n`);
}

console.log(`Generated ${companies.length} company JSON files.`);
