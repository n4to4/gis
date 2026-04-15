---
title: MVT
description: Mapbox Vector Tile。ベクター地物をタイル単位で配信するためのPBFベース形式。レイヤー構造、座標グリッド、属性表現、実装上の注意点を整理する。
---

MVTとは、Mapbox Vector Tileの略で、ベクター地物をタイル単位に分割し、Protocol Buffersベースのバイナリとして効率よく配信するための形式。

概要のあとで仕様の原文を追いたい場合は、[Format](https://mapbox.github.io/vector-tile-spec/#format)、[Encoding geometry](https://mapbox.github.io/vector-tile-spec/#encoding-geometry)、[Encoding attributes](https://mapbox.github.io/vector-tile-spec/#encoding-attributes) が入口になる。

## なぜ重要か

- ラスタータイルのように小さな矩形単位で配信できる一方、地物の属性や形状をベクターのまま保持できる
- ズームや画面解像度に応じてクライアント側でスタイル変更しやすい
- GeoJSONをそのまま送るより転送量を抑えやすく、大量地物の地図表示に向く
- MapLibre GL JS、Mapbox GL JS、OpenLayersなどの描画ライブラリが広く対応している
- 道路、建物、行政界、POIのような2D地図表現の配信形式として実務でよく使われる

## 何を表すのか

MVTの主役は、1枚のタイルの中に入るレイヤー集合である。

- 1つのタイルは1個以上の `layer` を持つ
- 各 `layer` は名前、地物列、属性辞書、座標グリッドの大きさを持つ
- 各 `feature` は `id`、属性参照、ジオメトリ種別、エンコード済み座標列を持つ
- ジオメトリは地理座標そのものではなく、タイル内部グリッド上の整数座標として入る

レイヤーや地物の定義は、仕様の [Format](https://mapbox.github.io/vector-tile-spec/#format) と `vector_tile.proto` に対応している。

重要なのは、MVT自体は配信単位とエンコード方式を定義する形式であり、タイルの取得方法、ズーム体系、スタイル指定までは定義しない点である。仕様の適用範囲の外側は、[What the spec doesn't cover](https://mapbox.github.io/vector-tile-spec/#what-the-spec-doesnt-cover) に明示されている。

## 基本構造

MVTを読むときは、`layer`、`feature`、`keys` / `values`、`extent`、`geometry` の役割を分けると追いやすい。

| 項目 | 役割 | 実装時の見どころ |
| --- | --- | --- |
| `layer.name` | レイヤー名 | スタイルや表示対象の切り替え単位になる |
| `layer.version` | 仕様のメジャーバージョン | 現実装では `2` を前提にすることが多い |
| `layer.extent` | タイル内座標グリッドの大きさ | 多くは `4096`。座標正規化時の分母になる |
| `layer.features` | 地物本体の配列 | 各地物の型、属性、座標列を読む |
| `feature.type` | `POINT` `LINESTRING` `POLYGON` の種別 | マルチ系も同じ型の繰り返しで表現される |
| `feature.tags` | 属性キーと値の参照列 | 偶数番目が `keys`、奇数番目が `values` の添字になる |
| `layer.keys` / `layer.values` | 属性辞書 | 同じ属性名や値の重複を減らす |
| `feature.geometry` | コマンド列で圧縮した座標 | `MoveTo`、`LineTo`、`ClosePath` の復号が必要になる |

この構造を追うと、MVTが「GeoJSONをそのままバイナリ化したもの」ではなく、レイヤー単位の辞書圧縮とタイル内整数座標を前提にした専用形式であることが分かる。

## ジオメトリはどう入るか

MVTのジオメトリは、緯度経度や投影座標をそのまま持たない。外側のタイル境界に対応するローカル座標グリッドへ変換された整数列を持つ。

- 原座標は通常、タイル生成前にWeb Mercator系のタイル空間へ射影される
- タイル内では `extent` を基準にした整数グリッドへ量子化される
- 座標列は絶対座標ではなく、前の点との差分を中心に圧縮される
- ジオメトリ型ごとに `MoveTo`、`LineTo`、`ClosePath` のコマンド列として保存される

ジオメトリの考え方は、[Encoding geometry](https://mapbox.github.io/vector-tile-spec/#encoding-geometry) に図付きで説明されている。

実装では、次の順で復号することが多い。

1. `feature.type` で点・線・ポリゴンのどれかを確認する
2. `feature.geometry` からコマンド整数列を順に読む
3. ZigZag復号とデルタ加算で整数座標列へ戻す
4. `extent` を使って表示ライブラリや内部表現の座標へ正規化する

ポリゴンではリングの向きも重要になる。仕様2.0以降では外周と内周の向きを区別する前提があり、詳細は [Winding order](https://mapbox.github.io/vector-tile-spec/#winding-order) にある。

## 属性はどう入るか

MVTの属性は、各地物が完全なキー文字列と値を直接持つのではなく、レイヤー内辞書への参照として保存される。

- `layer.keys` に属性名一覧が入る
- `layer.values` に属性値一覧が入る
- `feature.tags` は `[key_index, value_index, key_index, value_index, ...]` の整数列になる

この方式により、同じ属性名や文字列値が多数の地物で繰り返されても、タイル内では辞書を共有できる。考え方は [Encoding attributes](https://mapbox.github.io/vector-tile-spec/#encoding-attributes) に対応する。

## 読み方

MVTをデバッグするときは、次の順で見ると理解しやすい。

1. まずタイルにどの `layer.name` が入っているかを見る
2. 各 `layer` の `extent` と `version` を確認する
3. `features` を見て `type` と `tags` の有無を確認する
4. `keys` / `values` を引き、属性が何を表しているかを復元する
5. `geometry` を復号して、タイル境界やバッファを含めた形状を確認する

## 実装で見るポイント

- MVTはタイル内部座標しか持たないため、地理座標へ戻すにはXYZタイル座標系や投影法の外部情報が必要になる
- 仕様はクリッピングや簡略化の方法を定義しないため、生成ツールごとに境界付近の形状や頂点数が変わりうる
- ラベル切れを防ぐため、タイル境界の外へはみ出すバッファ付きジオメトリが入ることがある
- 属性型は数値、文字列、真偽値などを持てるが、元データの型体系を完全には保てない場合がある
- 面の向きやリング閉包を雑に扱うと、ポリゴンの塗り潰しや穴判定が崩れる
- 同じ地物が複数タイルへ分割されるため、MVT単体を完全なデータセットとして扱う設計には注意がいる

## 具体例

タイルをデコードしたあとの概念的な構造は次のようになる。

```txt
layers {
  version: 2
  name: "road"
  features {
    id: 101
    tags: 0
    tags: 0
    type: LINESTRING
    geometry: 9 120 340 18 20 0 0 15
  }
  keys: "class"
  values { string_value: "primary" }
  extent: 4096
}
```

この例では、`road` というレイヤーに1本の線地物が入っている。`tags: 0 0` は `keys[0] = "class"` と `values[0] = "primary"` を指し、`geometry` は線分を表すコマンド列である。重要なのは、属性本体と座標列が地物へ直接展開されず、辞書参照と圧縮命令として保持される点である。

## GeoJSONとの違い

MVTとGeoJSONはどちらもベクター地物を扱うが、役割が異なる。

| 観点 | MVT | GeoJSON |
| --- | --- | --- |
| 主な用途 | 地図表示向け配信 | データ交換、API応答、加工 |
| 格納形式 | PBFベースのバイナリ | JSONテキスト |
| 座標 | タイル内整数グリッド | 通常は地理座標や投影座標 |
| 単位 | 1タイルごと | ファイル全体や1レスポンス全体 |
| 属性 | レイヤー内辞書参照 | 各地物がそのまま保持 |
| 地物の完全性 | タイル境界で分割されうる | 単独地物として持ちやすい |

GeoJSONは加工やデバッグがしやすい一方、表示向け配信では重くなりやすい。MVTは表示効率に強い一方、単体で完結したデータ交換形式ではない。

## 制約・注意点

- MVTという名前でも、仕様そのものはMapbox Vector Tile Specificationであり、タイルURLテンプレートやスタイル仕様は別物である
- 仕様は「どうパックするか」を定義するが、「どのCRSを使うか」「どう簡略化するか」は定義しない
- `extent` が同じでも、生成時の簡略化やバッファ設定が違えば見た目は変わる
- 1枚のタイルだけでは隣接タイルとの連続性や元の完全な地物境界を復元できない場合がある
- バイナリ形式なので、問題調査では `vt2geojson` や `tippecanoe-decode` のようなデコーダーを通すことが多い

## 公式仕様・一次情報

- [Mapbox Vector Tile Specification 2.1](https://mapbox.github.io/vector-tile-spec/)
- [Format](https://mapbox.github.io/vector-tile-spec/#format)
- [Encoding geometry](https://mapbox.github.io/vector-tile-spec/#encoding-geometry)
- [Encoding attributes](https://mapbox.github.io/vector-tile-spec/#encoding-attributes)
- [Winding order](https://mapbox.github.io/vector-tile-spec/#winding-order)
- [What the spec doesn't cover](https://mapbox.github.io/vector-tile-spec/#what-the-spec-doesnt-cover)

## 関連概念

- [データフォーマット一覧](/gis/data-formats/)
- [3D Tiles](/gis/data-formats/3d-tiles/)
