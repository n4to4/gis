---
title: CityGML 2.0のGML
description: CityGML 2.0がGMLの上にどのように構築されているかを整理する。
---

CityGML 2.0は、GML（Geography Markup Language）を土台にした都市モデル表現。

## なぜ重要か

- CityGMLのジオメトリ表現はGMLの考え方を引き継ぐ
- XML要素の意味を読むには、GMLの基本を知る必要がある
- `gml:id` や座標表現、ジオメトリ型の理解につながる

## 仕組み・詳細

- GMLは地理情報をXMLで表現するための標準
- CityGMLはGMLのジオメトリと識別子の仕組みを利用する
- 地物はGMLの地物モデルの考え方を引き継いで記述される
- 座標や境界、面、立体の定義もGMLの表現に依存する

CityGML独自の要素だけ見ても、ファイル全体は理解しにくい。
`gml` 名前空間の要素が何を表しているかを読めることが重要。

## 具体例

- `gml:id`
  地物やジオメトリに一意な識別子を付ける

- `gml:Polygon`
  面を表す基本的なジオメトリ

- `gml:MultiSurface`
  複数の面で構成される形状を表す

- `gml:Solid`
  立体としての形状を表す

## 関連概念

- [CityGML 2.0](/gis/citygml-2-0/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
