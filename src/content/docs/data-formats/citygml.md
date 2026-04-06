---
title: CityGML
description: 3D都市モデルを表現するXMLベースの標準フォーマット。主にCityGML 2.0をベースに基本構造を整理する。
---

CityGMLとは、都市空間の3D地物を表現するための標準フォーマット。
このページでは、主にCityGML 2.0をベースに基本構造を扱う。

## なぜ重要か

- 建物・道路・橋梁・土地利用などを3Dで表現できる
- 形状だけでなく、地物の種類や属性も持てる
- 都市計画、防災、景観シミュレーション、デジタルツインで使われる
- 日本ではPLATEAUで触れる機会が多い

## 何を表現するフォーマットか

- XMLベースのフォーマット
- GML（Geography Markup Language）を土台にしている
- 都市を構成する地物を、意味を持つオブジェクトとして表現する
- 建物の外形だけでなく、用途、高さ、部位、関連地物も記述できる

CityGMLは、単なる3Dメッシュ形式ではない。
見た目の形状に加えて「これは建物」「これは道路」のような意味情報を持つ点が特徴。

## 基本構造

CityGMLの中心には、地物、属性、ジオメトリ、関係、LODという5つの観点がある。

| 観点 | 何を表すか | 実装で見るポイント |
| --- | --- | --- |
| 地物 | 建物、道路、水域などの意味的な単位 | どのモジュール、どの要素名で表現されるか |
| 属性 | 高さ、用途、名称、作成日など | 文字列かコード値か、欠損をどう扱うか |
| ジオメトリ | 点、面、立体などの形状 | `gml:Polygon`、`gml:MultiSurface`、`gml:Solid` の違い |
| 関係 | 地物どうしの包含、参照、部品関係 | `xlink:href` や親子構造をどう解決するか |
| LOD | 詳細度の段階 | 用途に対して十分な情報量があるか |

## 読むときの観察順

1. まず対象ファイルが `core:CityModel` を持つか確認する
2. `core:cityObjectMember` の下で、どの地物型が含まれているか確認する
3. 各地物の属性とLOD付きジオメトリ要素を読む
4. 必要に応じて `gml:id` と参照関係を追う

## 実装で見るポイント

- XMLをそのまま文字列処理せず、名前空間を理解できるXMLパーサで読む
- ジオメトリだけを抜き出すと、地物の意味情報や親子関係が落ちやすい
- LODごとに別要素へ入るため、単純な「geometry」1個というモデルには落としにくい
- GeoJSONやglTFへ変換するときは、意味情報をどこまで保持するかを先に決める必要がある

## 具体例

```xml
<core:cityObjectMember>
  <bldg:Building gml:id="bldg-1">
    <gml:name>sample-building</gml:name>
    <bldg:measuredHeight uom="m">32.4</bldg:measuredHeight>
    <bldg:lod2Solid>
      <gml:Solid>...</gml:Solid>
    </bldg:lod2Solid>
  </bldg:Building>
</core:cityObjectMember>
```

この例では、主役は `bldg:Building` である。`gml:id` が識別子、`bldg:measuredHeight` が属性、`bldg:lod2Solid` が詳細度付きジオメトリを表す。

## 制約・注意点

- CityGMLは汎用的な3D配信形式ではなく、意味論を含む都市モデル向けの表現である
- XMLと名前空間の構造が深く、ブラウザ向けの軽量表示用途にはそのままでは扱いにくい
- CityGML 2.0系の実データでは、同じ都市でもLODや属性の埋まり方にばらつきがある
- 形状だけを読む実装では、地物型や部品関係を見落としやすい

## 公式仕様・一次情報

- [OGC CityGML Standard](https://www.ogc.org/de/standards/citygml/)
- [OGC GML Standard](https://www.ogc.org/standards/gml/)

## CityGML 2.0の見取り図

実務や公開データでは、CityGML 2.0系を前提に読む場面がまだ多い。2.0の実データは、概ね「`core:CityModel` の中に `core:cityObjectMember` が並び、その中に地物、属性、LOD別ジオメトリが入る」という構造を持つ。

| 層 | 主な要素 | 役割 |
| --- | --- | --- |
| ルート | `core:CityModel` | ファイル全体の入れ物 |
| 地物列挙 | `core:cityObjectMember` | 地物を1件ずつ保持 |
| 地物本体 | `bldg:Building` など | 意味を持つ都市要素 |
| 詳細情報 | 属性、ジオメトリ、参照 | 実際の内容を保持 |

## 2.0系データを読むときの論点

- 名前空間の対応表を読まないと、`bldg` や `tran` の意味が分からない
- `gml:id` と `xlink:href` の参照関係を追える実装が必要になる
- 同一地物が複数LODを持つ場合、どのLODを採用するかを利用側で決める必要がある
- 別形式へ変換するときは、意味情報、部品関係、立体ジオメトリのどれを保持するかが論点になる

## 技術的詳細

CityGML 2.0の構成要素は、GML、LOD、XML構造、地物型の観点から詳しく見ていける。

- [CityGML 2.0のGML](/gis/citygml-2-0/gml/)
- [CityGML 2.0のLOD](/gis/citygml-2-0/lod/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
- [CityGML 2.0の地物型](/gis/citygml-2-0/feature-types/)

## CityGML 3.0

CityGML 3.0では、2.0の課題を踏まえてデータモデルが整理され、時間変化やバージョン管理なども扱いやすくなった。
詳細は別ページで扱う。

- [CityGML 3.0](/gis/data-formats/citygml-3-0/)

## 関連概念

- [データフォーマット一覧](/gis/data-formats/)
- [CityGML 3.0](/gis/data-formats/citygml-3-0/)
