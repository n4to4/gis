# 例：技術的に踏み込んだページの骨組み

ここでは、単なる定義紹介で終わらないページの形を例示する。
題材は `GeoJSON FeatureCollection` とする。

---

```markdown
---
title: GeoJSONのFeatureCollection
description: GeoJSONで複数の地物をまとめる基本単位。features配列を中心に、構造と実装上の注意点を整理する。
---

FeatureCollectionとは、複数のFeatureを1つのオブジェクトとしてまとめるGeoJSONの基本構造。

## なぜ重要か

- GeoJSONファイル全体がFeatureCollectionになっていることが多い
- 地図表示ライブラリやAPIの入出力で最もよく現れる
- 1件の地物ではなく、複数地物の集合として扱う処理の起点になる

## 何を持つか

FeatureCollectionの主役は `features` 配列である。

| フィールド | 役割 | 実装時の見どころ |
| --- | --- | --- |
| `type` | オブジェクト種別 | `FeatureCollection` であることを確認する |
| `features` | Featureの配列 | 配列長、各Featureのgeometry/property有無を見る |

## 読み方

1. `type` が `FeatureCollection` か確認する
2. `features` 配列を走査する
3. 各Featureの `geometry.type` と `properties` を読む

## 具体例

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [139.7671, 35.6812]
      },
      "properties": {
        "name": "東京駅"
      }
    }
  ]
}
```

この例では、ファイル全体は1つのFeatureCollectionであり、地物本体は `features` の中に入っている。表示処理では `features` を順に取り出して、`geometry.type` に応じて描画方法を切り替えることになる。

## 実装で見るポイント

- 空の `features` を許容するかを決める
- `geometry` が `null` のFeatureを扱うか確認する
- propertiesのスキーマが固定でない前提でパースする

## 制約・注意点

- FeatureCollection自体は座標参照系の変換機能を持たない
- 大量件数では、1ファイル全読み込みがボトルネックになりやすい
- 1件だけでもFeatureではなくFeatureCollectionで返すAPIが多い

## 関連概念との差分

- Featureは単一地物
- FeatureCollectionは複数地物のコンテナ
- GeometryCollectionは複数ジオメトリを1地物にまとめる構造
```

## この例で意識していること

- 定義だけで終わらず、構造・読み方・実装観点まで含める
- 「何が主役か」を明示する
- コードを書く人が、次に何を見ればよいか分かる
