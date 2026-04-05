---
title: CityGML 2.0の地物型
description: CityGML 2.0が標準で扱う主要な地物型を整理する。
---

CityGML 2.0では、都市を構成する要素を地物型ごとに分けて表現する。

## なぜ重要か

- 何を表現できるフォーマットかを把握できる
- 建物だけでなく、道路、水域、植生なども扱えることが分かる
- モジュールごとの役割を理解すると、XMLの読み方も分かりやすくなる

## 仕組み・詳細

代表的な地物型には次のようなものがある。

- Building
  建物、建物部品、開口部などを表す

- Transportation
  道路、鉄道、広場などの交通系地物を表す

- Relief
  地形や標高面を表す

- WaterBody
  河川、湖沼、海域などの水域を表す

- Vegetation
  樹木や植生区域を表す

- LandUse
  土地利用区分を表す

- Bridge
  橋梁を表す

- Tunnel
  トンネルを表す

地物型ごとに使う名前空間や持てる属性が異なる。
実データを読むときは、まず対象の地物型を見つけると理解しやすい。

## 具体例

- `bldg:Building`
  建物本体

- `tran:Road`
  道路

- `dem:ReliefFeature`
  地形表現

- `wtr:WaterBody`
  水域

## 関連概念

- [CityGML 2.0](/gis/citygml-2-0/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
