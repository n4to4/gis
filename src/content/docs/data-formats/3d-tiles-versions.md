---
title: 3D Tiles のバージョン差分
description: 3D Tiles 1.0 と 1.1 の確定した差分と、Cesium の 2026 年資料で示された 2.0 の方向性を比較する。
---

3D Tiles のバージョン差分とは、3D Tiles 1.0、1.1、および 2.0 と呼ばれている次世代方向の違いを、構造、コンテンツ、メタデータ、実装上の影響の観点から整理したものである。

## 位置づけ

3D Tiles では、版ごとに設計の重心が少しずつ変わっている。

- 1.0 は独自のタイル形式を中心にした初期の標準
- 1.1 は glTF 2.0 を中心に再整理した現行標準
- 2.0 は Cesium の 2026-03-03 の OGC Member Meeting 資料で示された次世代方向

1.0 と 1.1 は OGC Community Standard として公開されている。  
一方で 2.0 は、このページでは確定済みの正式仕様としてではなく、将来方向を示す資料に基づく整理として扱う。

- 1.0: [OGC 3D Tiles 1.0](https://docs.ogc.org/cs/18-053r2/18-053r2.html)
- 1.1: [OGC 3D Tiles 1.1](https://docs.ogc.org/cs/22-025r4/22-025r4.html)
- 2.0 方向: [2026 OGC Member Meeting Philly PDF](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 共通する骨格

版が変わっても、3D Tiles の基本的な役割は大きく変わらない。

- 3D 空間データをタイル単位に分割して段階配信する
- 空間範囲と LOD を使って、必要な部分だけを読む
- 1 つの巨大モデルではなく、タイル木として全体を表現する

つまり差分を見るときも、まず共通部分として `tileset`、`tile`、`boundingVolume`、`geometricError` のような概念があり、その上でコンテンツ形式や周辺機能の設計が変わってきたと捉えると整理しやすい。

## 版ごとの差分の全体像

| 観点 | 1.0 | 1.1 | 2.0 の方向 |
| --- | --- | --- | --- |
| 主なコンテンツ | `b3dm` `i3dm` `pnts` `cmpt` | glTF 2.0 が中心 | glTF を基盤に再整理 |
| タイル木の中心 | `tileset.json` | `tileset.json` | `tileset.json` を継続しつつ glTF 側との統合を強化 |
| メタデータ | 制約が大きい | 構造化メタデータ | glTF 基盤と統一的に扱う方向 |
| 複数コンテンツ | 弱い | 対応 | glTF の複雑なシーン構造へ寄せる |
| タイル列挙 | 明示列挙中心 | implicit tiling 対応 | implicit tiling を含む空間構造を活用 |
| 主な対象 | 建物、点群、インスタンス | 左に加えて metadata や表現力を強化 | voxel、時系列、ベクター、AEC まで拡張 |
| 実装の主な論点 | legacy loader | glTF 中心のローダー設計 | glTF scene graph と geospatial 拡張の統合 |

## 1.0 と 1.1 の差分

1.0 から 1.1 への変化は、単なる機能追加ではなく、3D Tiles の重心を独自バイナリ形式から glTF 中心へ移した点が大きい。

### コンテンツ形式

1.0 では、主なタイル内容は `b3dm`、`i3dm`、`pnts`、`cmpt` だった。  
1.1 では glTF 2.0 が主なタイル内容になり、これらの legacy formats は非推奨になった。  
この差分は、3D コンテンツの表現をより一般的な glTF のエコシステムへ寄せる変化である。

- 1.1 の tile formats: [OGC 3D Tiles 1.1, 6.8 Tile format specifications](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc36)
- version history: [CesiumGS 3d-tiles CHANGES.md](https://github.com/CesiumGS/3d-tiles/blob/main/CHANGES.md)

### メタデータ

1.0 にも属性的な情報はあったが、表現力や構造化の面で制約が大きかった。  
1.1 では metadata が大きく整理され、タイルセット、タイル、コンテンツ群など複数粒度に属性を結び付けやすくなった。

この差分は、単なる表示用データではなく、検索、選択、スタイリング、意味情報の保持を実装しやすくする点で重要である。

- metadata の位置づけ: [OGC 3D Tiles 1.1, 6.7 Metadata specification](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc35)

### 複数コンテンツ

1.0 では 1 タイル 1 コンテンツに近い発想が強かった。  
1.1 では multiple contents に対応し、同じタイルに複数のコンテンツを持たせられる。

この差分は、同じ空間範囲に複数表現を重ねる設計や、レイヤー的な構成を取りやすくする。

- multiple contents: [OGC 3D Tiles 1.1, 6.4.1 Multiple contents](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc24)

### タイル木の表現

1.0 では子タイルを JSON に明示列挙する構造が中心だった。  
1.1 では implicit tiling が導入され、巨大なタイル木をよりコンパクトに表現できる。

この差分は、都市規模や全国規模の大きなデータで特に効く。子ノードをすべて JSON に書かずに済むため、配信量と管理コストを抑えやすい。

- implicit tiling: [OGC 3D Tiles 1.1, 6.8.2 Implicit tiles](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc39)

## 2.0 で議論されている方向

Cesium の 2026-03-03 の資料では、`3D Tiles 2.0 - 3D Tiles baselined on glTF` と説明されている。  
ここで重要なのは、2.0 を新しい独自形式として見るのではなく、3D Tiles を glTF 基盤で再整理する方向として捉えることである。

- 資料中の要約: [2026 OGC Member Meeting Philly PDF, p.4](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### glTF ベースライン化

資料では次の流れが示されている。

- 1.0: `b3dm` と `i3dm` が binary glTF を包む
- 1.1: glTF を tile content として直接参照する
- 2.0: 3D Tiles を glTF 基盤で扱う

この流れは、3D Tiles の外側に glTF を置くのではなく、シーン表現そのものを glTF とより近い形で扱う方向を意味する。

### 複雑なシーン構造

資料では、2.0 の主要な論点として次が並んでいる。

- bounding volume hierarchy
- level of detail
- external glTF references

これは、3D Tiles が得意としてきた空間階層や LOD の考え方を、glTF の scene graph と近い形で扱いたい、という方向である。

たとえば external glTF references では、複数の glTF アセットを外部参照で組み合わせてシーンを構成する例が示されている。level of detail でも、ノード単位で `refine` や `geometricError` を持つ構成例が出てくる。

- external references と LOD の例: [2026 OGC Member Meeting Philly PDF, pp.7-9](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### 地理空間向け拡張

資料では geospatial extensions として次が挙げられている。

- region bounding volume
- S2 tiling scheme
- CRS / ellipsoid

これは、glTF をそのまま使うだけでは足りない地理空間特有の要件を、拡張として組み込む方向である。  
2.0 の本質は glTF への単純な吸収ではなく、glTF を基盤にしつつ geospatial な情報を足す点にある。

- geospatial extensions の一覧: [2026 OGC Member Meeting Philly PDF, p.5](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### 新しい対象データ

資料では、2.0 方向で扱いたい対象として次の話題が続いている。

- voxel data
- time-dynamic 3D Tiles
- vector data support
- AEC extensions

つまり 2.0 は、建物やフォトグラメトリを配信するだけでなく、時系列、地下、設計モデル、3D ベクターデータまで含めた広い用途を見据えている。

- voxels: [2026 OGC Member Meeting Philly PDF, pp.14-18](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)
- time-dynamic: [2026 OGC Member Meeting Philly PDF, pp.20-23](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)
- vector support: [2026 OGC Member Meeting Philly PDF, pp.25-32](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 実装者への影響

実装の観点では、版ごとに見るべき場所が変わる。

1. 1.0 を読む実装では、まず legacy formats のローダーと tileset JSON の対応関係を見る
2. 1.1 を読む実装では、glTF ローダーと metadata、implicit tiling を分けて設計する
3. 2.0 方向を追う実装では、glTF scene graph と geospatial 拡張をどう接続するかが主な論点になる

移行方針としては、新規実装では 1.1 を前提に設計し、1.0 は互換対応として扱う方が整理しやすい。  
2.0 は、すぐに全面移行先として決め打ちするより、glTF 側の schema、拡張、サンプル実装の動きを追いながら評価する段階と見るのが妥当である。

## 注意点

- 1.0 と 1.1 は確定済みの OGC Community Standard
- このページの 2.0 は、2026-03-03 の Cesium 発表資料を元にした将来方向の整理
- 資料内でも `Continuing to support 3D Tiles 1.1 and tileset.json` とされており、1.1 系の理解は引き続き重要

- roadmap の記述: [2026 OGC Member Meeting Philly PDF, p.12](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 関連概念

- [3D Tiles](/gis/data-formats/3d-tiles/)
- [glTF](/gis/data-formats/gltf/)
- [データフォーマット一覧](/gis/data-formats/)
