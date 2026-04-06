---
title: CityGML 3.0 GML Encoding Standard
description: CityGML 3.0 Part 2で定義されるGML/XMLエンコーディング。Conceptual ModelをXMLへどう写像するか、名前空間、識別子、読み方、2.0との差分を整理する。
---

CityGML 3.0 GML Encoding Standardとは、Conceptual Model Standardで定義された概念をGML/XMLへ写像するPart 2の標準。

## なぜ重要か

- 実務の交換形式としては、引き続きGML/XMLが中心になる場面が多い
- XMLスキーマ、名前空間、識別子、参照の具体的な形はPart 2で定義される
- Conceptual Modelの理解だけでは不足する、実際の読み取り順やバリデーション方法を把握できる
- 2.0から3.0への移行では、XML上で何が変わるかを見極める必要がある

## 何を定義する標準か

Part 2は、Part 1の概念モデルをGML 3.2/3.3準拠のXML表現へ写像する。

| 項目 | 役割 | 実装時の見どころ |
| --- | --- | --- |
| XML名前空間 | モジュールごとの責務を区別する | `core`、`bldg`、`con`、`vers` などを正しく読む |
| GML要素 | ジオメトリ、識別子、参照の基盤を提供する | `gml:id`、`gml:identifier`、`gml:Solid` などを見る |
| XSD群 | 各モジュールの文法を定義する | サポート対象のモジュールを明確にできる |
| UML-to-GML写像 | Part 1のクラスをどうXML化するかを定義する | クラス、属性、関連がどの要素になるかを追える |
| 参照機構 | 地物間や幾何の参照を表す | `xlink:href` の解決順序が重要になる |

## XML構造の基本

CityGML 3.0のGML文書も、基本的な入口は `core:CityModel` である。

| 層 | 代表要素 | 役割 |
| --- | --- | --- |
| ルート | `core:CityModel` | 文書全体の入れ物 |
| 地物列挙 | `core:cityObjectMember` | 都市地物を列挙する |
| 地物本体 | `bldg:Building`、`tran:Road` など | 意味を持つ都市要素 |
| 幾何・属性 | `gml:*`、各モジュール要素 | 実データ本体 |
| 履歴・動的情報 | `vers:*`、`dyn:*` など | 版管理や時系列変化を表す |

2.0との大きな違いは、XML構造の見た目が似ていても、背後の概念整理が変わっている点にある。3.0では、Part 1の責務分担に合わせてXMLを読む必要がある。

## 識別子と参照

Part 2では、識別子まわりを丁寧に切り分けて読む必要がある。

- `gml:id` はXML文書内での地物識別に使う
- `gml:identifier` は実体としての安定識別子に使う
- 版違いの同一地物を扱う場合、`gml:id` と `gml:identifier` を同一視しない方がよい
- `xlink:href` や関連要素により、別要素への参照が張られる

2.0でも `gml:id` は重要だったが、3.0ではVersioningとの組み合わせで「同じ実体の別バージョン」を扱う場面が増えるため、`gml:identifier` の意味がより重要になる。

## 読み方

GML/XML文書を読むときは、次の順が追いやすい。

1. ルートの `core:CityModel` と名前空間宣言を見る
2. 使用モジュールに対応するXSDと接頭辞を確認する
3. `core:cityObjectMember` を走査して主役の地物型を特定する
4. `gml:id` と `gml:identifier` を見て識別戦略を把握する
5. ジオメトリ要素、空間要素、Versioning要素、Dynamizer要素を順に追う

## 具体例

建物をGML/XMLとして読む最小断片は次のようになる。

```xml
<core:CityModel
  xmlns:core="http://www.opengis.net/citygml/3.0"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:bldg="http://www.opengis.net/citygml/building/3.0">
  <core:cityObjectMember>
    <bldg:Building gml:id="bldg-1-v1">
      <gml:identifier codeSpace="https://example.com/buildings">bldg-1</gml:identifier>
      <bldg:function>office</bldg:function>
    </bldg:Building>
  </core:cityObjectMember>
</core:CityModel>
```

この例では、ルートは `core:CityModel`、主役の地物は `bldg:Building`、XML内識別は `gml:id`、実体識別は `gml:identifier` である。Part 2を読むときは、どの概念がGML要素へどう写像されたかを対応づけることが重要になる。

## 2.0との違い

| 観点 | CityGML 2.0 XML | CityGML 3.0 Part 2 |
| --- | --- | --- |
| 位置付け | 標準の中心として読まれやすい | Conceptual Modelの実装仕様として読む |
| 準拠先 | GMLベース | GML 3.2 / 3.3 準拠の写像 |
| 識別子 | `gml:id` 中心になりやすい | `gml:id` と `gml:identifier` を分けやすい |
| LOD理解 | 要素名ベースの理解になりやすい | Part 1のLOD概念を前提に読む |
| 履歴管理 | 標準機構が薄い | VersioningモジュールをXMLとして持てる |

## 実装で見るポイント

- 2.0用のXPathや要素名決め打ち実装は、そのままでは3.0で不足しやすい
- 名前空間接頭辞ではなく、URIで判定する実装の方が安全である
- XMLスキーマ検証は有効だが、概念的な整合性までは保証しない
- `xlink:href` を使う場合、1パス読み込みだけでは参照解決が完結しないことがある
- GMLの `Polygon`、`MultiSurface`、`Solid` を平面系へ落とすときは、立体性や境界関係が失われやすい
- VersioningやDynamizerを扱う場合、通常の地物パーサーとは別に履歴・時系列の処理系が必要になる

## 制約・注意点

- Part 2だけ読んでも、なぜそのXML構造になっているかはPart 1を見ないと分かりにくい
- 逆にPart 1だけ読んでも、実際の要素名やXSD分割は把握できない
- ツールが「CityGML 3.0対応」としていても、Part 2の全モジュールに対応するとは限らない
- XMLで運用する場合でも、内部モデルをPart 1寄りに設計した方が将来の別エンコーディングへ移りやすい

## 公式仕様・一次情報

- [OGC CityGML 3.0 Part 2: GML Encoding Standard](https://docs.ogc.org/is/21-006r2/21-006r2.html)
- [OGC CityGML 3.0 Part 1: Conceptual Model Standard](https://docs.ogc.org/is/20-010/20-010.html)

## 関連概念

- [CityGML 3.0](/gis/data-formats/citygml-3-0/)
- [CityGML 3.0 Conceptual Model Standard](/gis/data-formats/citygml-3-0/conceptual-model-standard/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
