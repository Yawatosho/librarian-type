export type AxisValue = "P" | "C" | "Q" | "O" | "R" | "D" | "X" | "S";

export type Question = {
  id: number;
  prompt: string;
  answers: [{ text: string; value: AxisValue }, { text: string; value: AxisValue }];
};

export type Result = {
  internalCode: string;
  slug: string;
  name: string;
  catchCopy: string;
  description: string;
  likes: [string, string, string];
  illustration: string;
  ogImage: string;
  recommendedGames: [string, string];
};

export const questions: Question[] = [
  { id: 1, prompt: "新しいサービスのアイデアが浮かんだ。", answers: [{ text: "まず小さく試してみたい", value: "X" }, { text: "運用方法をきちんと考えてから始めたい", value: "S" }] },
  { id: 2, prompt: "少し余裕のある午後。\nどちらの仕事に自然と手が伸びる？", answers: [{ text: "書架やデータを整える", value: "C" }, { text: "利用者の様子を見たり、相談に乗ったりする", value: "P" }] },
  { id: 3, prompt: "「前に見た青い本を探しています」と言われた。", answers: [{ text: "いつ、どこで、何のために見たのか聞いてみたい", value: "Q" }, { text: "分かっている条件を整理して候補を絞りたい", value: "O" }] },
  { id: 4, prompt: "突然カウンターが混み始めた。", answers: [{ text: "対応しながら、その場で考える", value: "R" }, { text: "まず状況を見て、どう回すか考える", value: "D" }] },
  { id: 5, prompt: "一日の終わり。\n「今日は仕事したな」と感じるのは？", answers: [{ text: "利用者からいい反応が返ってきたとき", value: "P" }, { text: "資料やデータがきれいに整ったとき", value: "C" }] },
  { id: 6, prompt: "面白そうな新しいツールを見つけた。", answers: [{ text: "とりあえず触ってみる", value: "X" }, { text: "事例や条件を調べてから使ってみる", value: "S" }] },
  { id: 7, prompt: "あるはずの本が一冊見つからない。", answers: [{ text: "どうしてなくなったのか経緯が気になる", value: "Q" }, { text: "ありそうな場所を順番に確認していく", value: "O" }] },
  { id: 8, prompt: "初めて担当する仕事を任された。", answers: [{ text: "一度やってみて流れをつかみたい", value: "R" }, { text: "手順を理解してから始めたい", value: "D" }] },
  { id: 9, prompt: "好きな担当を選べるとしたら？", answers: [{ text: "展示・広報・利用者サービスのような仕事", value: "P" }, { text: "蔵書・目録・メタデータのような仕事", value: "C" }] },
  { id: 10, prompt: "今の業務手順に少し違和感がある。", answers: [{ text: "小さく変えて、うまくいくか試したい", value: "X" }, { text: "まず、なぜこの手順なのか調べたい", value: "S" }] },
  { id: 11, prompt: "調べものをしているとき楽しいのは？", answers: [{ text: "思いがけない資料やつながりを見つけること", value: "Q" }, { text: "情報を整理して全体像が見えてくること", value: "O" }] },
  { id: 12, prompt: "締切が近づいてきた。", answers: [{ text: "まず形にして、あとから直していく", value: "R" }, { text: "ある程度納得できるところまで考えてから出す", value: "D" }] },
];

export const recommendedGames = {
  reference: { title: "レファレンス・ラリー", note: "調べるほど、次の手がかりが見つかる。", href: "#" },
  ndc: { title: "NDCクイズ", note: "分類の世界を、クイズでもう少し。", href: "#" },
  shelf: { title: "書架パトロール", note: "棚の中の小さな異変を見逃すな。", href: "#" },
  karuta: { title: "図書館あるあるかるた", note: "あの瞬間を、みんなで取る。", href: "#" },
};

const result = (internalCode: string, slug: string, name: string, catchCopy: string, description: string, likes: [string, string, string], recommended: [string, string]): Result => ({
  internalCode, slug, name, catchCopy, description, likes, recommendedGames: recommended,
  illustration: `/assets/result-illustrations/${slug}.png`,
  ogImage: `/assets/result-ogp/${slug}.webp`,
});

export const results: Result[] = [
  result("PQRX", "reference-runner", "レファレンス走りながら考える派", "まず聞く。まず探す。答えは走りながら。", "相談を受けると、まず聞いて、まず探して、そこから次の手を考えるタイプ。最初から完璧な検索式を作るより、利用者とのやり取りや検索結果を見ながら方向を変えていきます。", ["検索結果から次のキーワードを拾う", "相談中に方針がひらめく", "答えまでの道草も楽しむ"], ["reference", "karuta"]),
  result("PQRS", "counter-detective", "カウンター探偵", "その一言、大事な手がかりかも。", "利用者の何気ない一言から、重要な手がかりを拾うタイプ。「つまり、本当に知りたいのはこっちでは？」と、会話の中から質問の核心を見つけていきます。", ["曖昧な記憶から手がかりを集める", "話の奥にある「本当の質問」を探す", "見つかった瞬間の小さな達成感"], ["reference", "karuta"]),
  result("PQDX", "reference-deep-dive", "レファレンス沼の住人", "ひとつ調べると、三つ気になる。", "一つの相談を調べ始めると、背景や関連情報まで気になってくるタイプ。気がつけば、最初の質問よりずっと深いところまで潜っています。", ["参考文献の参考文献までたどる", "背景を知ってから本題に戻る", "偶然見つけた周辺情報もメモする"], ["reference", "ndc"]),
  result("PQDS", "reference-interview", "レファレンスインタビュー深掘り派", "検索窓を開く前に、もうひとつ質問を。", "検索を始める前に、まず利用者の話を丁寧に聞きたいタイプ。「何を知りたいのか」「何に使うのか」を一つずつ整理していきます。", ["相手の言葉で質問を言い換える", "用途が分かって探しやすくなる瞬間", "「そう、それです」の一言"], ["reference", "karuta"]),
  result("PORX", "service-lab", "利用者サービス実験部", "「こうしたら？」は、小さく試す。", "「こうした方が使いやすいかも」と思ったら、小さく試してみたくなるタイプ。案内、展示、サービス、Webなどを試しながら改善していきます。", ["手作りの試作版", "利用者の反応をすぐ見る", "小さな変化の手応え"], ["karuta", "reference"]),
  result("PORS", "counter-controller", "カウンター交通整理係", "混んできたら、頭の中に交差点。", "複数の利用者が同時に来ても、誰からどう対応するかを自然と考えているタイプ。いろいろ重なっても、気がつけばカウンターを回しています。", ["一言声をかけて待ってもらう", "複数の対応を頭の中で並べる", "ピーク後の静けさ"], ["karuta", "reference"]),
  result("PODX", "user-flow", "利用者動線研究部", "その立ち止まりに、ヒントがある。", "利用者がどこで迷うか、どこで立ち止まるかが気になるタイプ。図書館の「使われ方」そのものを観察しています。", ["迷いやすい場所を見つける", "案内の前で立ち止まる時間を観察する", "レイアウトの小さな仮説"], ["shelf", "karuta"]),
  result("PODS", "guide-planner", "館内案内先回り係", "迷う前に、そこに一言。", "利用者が困る前に、分かりやすくしておきたいタイプ。案内表示、説明文、FAQ、館内サインなどを丁寧に整えます。", ["説明文を一文短くする", "矢印の向きを確かめる", "聞かれる前に届く案内"], ["karuta", "shelf"]),
  result("CQRX", "shelf-browser", "書架ブラウジング派", "目的の本の隣が、また面白い。", "目的の本を探していただけなのに、隣の棚が気になってしまうタイプ。書架を歩いていると、予定になかった発見が増えていきます。", ["隣合う請求記号の意外なつながり", "返却台の偶然な並び", "用事のない棚に寄り道する"], ["shelf", "ndc"]),
  result("CQRS", "missing-material", "行方不明資料捜索班", "「あるはず」は、探したくなる。", "「あるはずなのに見つからない」と聞くと、少し探したくなるタイプ。配架場所、返却棚、利用状況、似た請求記号などを一つずつ確認します。", ["似た背表紙の間をのぞく", "可能性を一つずつ消す", "見つけた本を黙って掲げる"], ["shelf", "ndc"]),
  result("CQDX", "selection-deep-dive", "選書沼の住人", "「これも必要かも」が、どんどん増える。", "資料を選び始めると、「これも必要かも」「この分野も揃えたい」と候補が広がっていくタイプ。", ["刊行情報の比較", "蔵書の空白を見つける", "候補リストを育てる"], ["ndc", "shelf"]),
  result("CQDS", "edition-checker", "異版が気になる人", "同じタイトル。でも、同じ本？", "タイトルが同じでも、版や出版年が違うと少し気になるタイプ。改訂版、旧版、翻訳違いなどをつい確認します。", ["版表示を見比べる", "翻訳者の違いを確かめる", "「改訂」の二文字を見逃さない"], ["ndc", "reference"]),
  result("CORX", "shelving-tuner", "配架チューニング派", "この棚、もう少し使いやすくできそう。", "書架の状態を見ながら、「ここ、もう少し使いやすくできそう」と考えるタイプ。配置やサイン、棚の使い方などを実際に試しながら調整します。", ["棚の余白を整える", "差し込むサインを試作する", "反応を見てまた少し動かす"], ["shelf", "ndc"]),
  result("CORS", "call-number", "請求記号ぴったり派", "あるべき場所にある。それがいい。", "本があるべき場所にきちんと並んでいると、少し安心するタイプ。違う場所の本を見つけると、つい正しい場所へ戻したくなります。", ["数字と記号のきれいな並び", "見つけた誤配架をそっと戻す", "整然とした棚の前を通る"], ["ndc", "shelf"]),
  result("CODX", "classification-tinkerer", "分類体系いじり屋", "整理の方法そのものを、考えたい。", "資料を整理するだけでなく、「この分け方、本当に一番分かりやすい？」と、分類の仕組みそのものを考えたくなるタイプ。", ["例外からルールを見直す", "利用者の言葉と分類をつなぐ", "より納得できる仕切りを考える"], ["ndc", "shelf"]),
  result("CODS", "authority-control", "典拠が合うと落ち着く人", "名前と名前が、きれいにつながる。ちょっと嬉しい。", "名称や表記がきれいにつながり、データの整合性が取れていると少し嬉しいタイプ。細かな違いを確認しながら、一つずつ丁寧に整えます。", ["表記ゆれをひとつにつなぐ", "同名異人をきちんと分ける", "データの整合性が取れた瞬間"], ["ndc", "reference"]),
];

export const resultByCode = Object.fromEntries(results.map((item) => [item.internalCode, item]));
export const resultBySlug = Object.fromEntries(results.map((item) => [item.slug, item]));
