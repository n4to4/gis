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

## 関連概念

- [CityGML 2.0](/gis/citygml-2-0/)
- [CityGML 2.0のGML](/gis/citygml-2-0/gml/)
- [CityGML 2.0の地物型](/gis/citygml-2-0/feature-types/)
