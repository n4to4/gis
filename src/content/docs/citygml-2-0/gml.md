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

## 主なGML要素

| 要素 | 役割 | 実装時の見どころ |
| --- | --- | --- |
| `gml:id` | 要素の一意識別子 | 参照解決や差分管理の起点になる |
| `gml:name` | 人が読む名称 | 補助情報であり、識別子ではない |
| `gml:Polygon` | 単一の面 | 外周と内周のリング構造を見る |
| `gml:MultiSurface` | 複数面の集合 | 建物外形でよく使われる |
| `gml:Solid` | 立体 | 表面集合が閉じている前提を確認する |
| `gml:posList` | 座標列 | 次元数、座標順序、区切り方に注意する |

## 読み方

1. まず `gml:id` の有無を確認する
2. 次に、ジオメトリが `Polygon`、`MultiSurface`、`Solid` のどれかを見る
3. 最後に `gml:posList` や境界要素を追って、実際の座標列を読む

## 具体例

```xml
<gml:Polygon gml:id="poly-1">
  <gml:exterior>
    <gml:LinearRing>
      <gml:posList>
        139.0 35.0 0 139.1 35.0 0 139.1 35.1 0 139.0 35.1 0 139.0 35.0 0
      </gml:posList>
    </gml:LinearRing>
  </gml:exterior>
</gml:Polygon>
```

この例では、`gml:Polygon` が面そのもの、`gml:LinearRing` が境界、`gml:posList` が座標列を表す。座標列は開始点と終了点が一致する閉じたリングでなければならない。

## 実装で見るポイント

- `gml:posList` の値を読むときは、2次元か3次元かを前提なく決め打ちしない
- `Polygon` と `MultiSurface` は同じ「面系」でも扱いが異なるため、単一モデルへ雑に丸めない
- 立体を平面へ落とすときは、高さ情報や面の向きが失われる

## 制約・注意点

- GMLは柔軟だが、その分だけ実装が重くなりやすい
- 同じ面系ジオメトリでも、提供データによって表現の粒度が異なる
- XML断片だけ見て座標系まで決め打ちすると誤ることがある

## 公式仕様・一次情報

- [OGC GML Standard](https://www.ogc.org/standards/gml/)

## 関連概念

- [CityGML](/gis/data-formats/citygml/)
- [CityGML 2.0のXML構造](/gis/citygml-2-0/xml-structure/)
