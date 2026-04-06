---
title: CityGML 2.0のXML構造
description: CityGML 2.0ファイルを読むために、ルート要素、名前空間、ID、主要な入れ子構造を整理する。
---

CityGML 2.0のファイルはXMLとして記述される。

## なぜ重要か

- まずXML構造を読めないと、地物や属性の位置が追えない
- 名前空間を理解すると、どの要素がどの仕様に属するか分かる
- 変換処理やパース実装でも基本になる

## 仕組み・詳細

CityGML 2.0のファイルでは、次のような構造をよく見る。

- ルート要素
  多くの場合 `core:CityModel` が全体の入れ物になる

- 名前空間
  `core`、`gml`、`bldg`、`tran` のように、モジュールごとに接頭辞が分かれる

- 識別子
  `gml:id` で地物やジオメトリに一意なIDを付ける

- 地物の列挙
  `core:cityObjectMember` の下に建物や道路などの地物が並ぶ

- 空間範囲
  `gml:boundedBy` でデータ全体の範囲を持つことがある

## 主要な入れ子

| 層 | 代表要素 | 役割 |
| --- | --- | --- |
| ルート | `core:CityModel` | 文書全体の入れ物 |
| 地物メンバー | `core:cityObjectMember` | 地物を1件ずつ包む |
| 地物本体 | `bldg:Building` など | 意味的な都市要素 |
| 属性・ジオメトリ | `gml:name`、`bldg:lod2Solid` など | 内容を保持 |

## 読み方

1. ルート要素と名前空間宣言を見る
2. `core:cityObjectMember` を順に追う
3. 各地物の型を確認する
4. 属性、LOD別ジオメトリ、参照関係を読む

## 具体例

```xml
<core:CityModel xmlns:core="..." xmlns:gml="..." xmlns:bldg="...">
  <gml:boundedBy>...</gml:boundedBy>
  <core:cityObjectMember>
    <bldg:Building gml:id="b1">
      ...
    </bldg:Building>
  </core:cityObjectMember>
</core:CityModel>
```

この構造を読むときは、まず `CityModel`、次に `cityObjectMember`、その中の地物型、最後に属性やジオメトリを見ると追いやすい。

## 実装で見るポイント

- 名前空間接頭辞そのものではなく、名前空間URIで判定する方が安全である
- DOM走査でもストリーミングパースでも、`cityObjectMember` 単位で処理すると見通しがよい
- `xlink:href` による外部参照や内部参照がある場合、1パスでは完結しないことがある
- ルート近くの `gml:boundedBy` は全体範囲であり、各地物のジオメトリそのものではない

## 制約・注意点

- XMLの木構造とCityGMLの意味構造は必ずしも一致しない
- 名前空間を無視すると、異なるモジュールの同名要素を誤認しやすい
- XPathを使う実装では、名前空間対応を忘れると一致しない

## 公式仕様・一次情報

- [OGC CityGML Standard](https://www.ogc.org/de/standards/citygml/)
- [OGC GML Standard](https://www.ogc.org/standards/gml/)

## 関連概念

- [CityGML](/gis/data-formats/citygml/)
- [CityGML 2.0のGML](/gis/citygml-2-0/gml/)
- [CityGML 2.0の地物型](/gis/citygml-2-0/feature-types/)
