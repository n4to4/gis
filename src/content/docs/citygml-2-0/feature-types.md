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

## モジュールと地物型

| モジュール | 代表要素 | 表す対象 |
| --- | --- | --- |
| `bldg` | `bldg:Building` | 建物、建物部品、開口部 |
| `tran` | `tran:Road` | 道路、鉄道、広場 |
| `dem` | `dem:ReliefFeature` | 地形、標高面 |
| `wtr` | `wtr:WaterBody` | 河川、湖沼、海域 |
| `veg` | `veg:SolitaryVegetationObject` | 樹木、植生 |
| `luse` | `luse:LandUse` | 土地利用 |
| `brid` | `brid:Bridge` | 橋梁 |
| `tun` | `tun:Tunnel` | トンネル |

## 実装で見るポイント

- 地物型が分かると、その後に現れる属性やジオメトリの意味を絞り込める
- 単に外形を描画するだけなら地物型を落としてもよい場合があるが、検索、解析、スタイリングでは保持した方がよい
- 変換先がGeoJSONのような単純なモデルの場合、地物型は `properties` へ退避する設計が必要になることが多い

## 制約・注意点

- すべてのデータが全モジュールを使うわけではない
- 同じ建物でも、部品や境界面まで細かく持つデータと、建物本体だけのデータがある
- 地物型が分かっても、属性コード体系や業務上の意味は別仕様に依存することがある

## 具体例

- `bldg:Building`
  建物本体

- `tran:Road`
  道路

- `dem:ReliefFeature`
  地形表現

- `wtr:WaterBody`
  水域

## 公式仕様・一次情報

- [OGC CityGML Standard](https://www.ogc.org/de/standards/citygml/)

## 関連概念

- [CityGML](/gis/data-formats/citygml/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
