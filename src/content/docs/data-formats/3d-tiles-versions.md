---
title: 3D Tiles のバージョン差分
description: 3D Tiles 1.0 と 1.1 の確定した差分と、Cesium の 2026 年資料で示された 2.0 の方向性を比較する。
---

3D Tilesのバージョン差分とは、3D Tiles 1.0、1.1、および2.0と呼ばれている次世代方向の違いを、構造、コンテンツ、メタデータ、実装上の影響の観点から整理したものである。

## 位置づけ

3D Tilesでは、版ごとに設計の重心が少しずつ変わっている。

- 1.0は独自のタイル形式を中心にした初期の標準
- 1.1はglTF 2.0を中心に再整理した現行標準
- 2.0はCesiumの2026-03-03のOGC Member Meeting資料で示された次世代方向

1.0と1.1はOGC Community Standardとして公開されている。  
一方で2.0は、このページでは確定済みの正式仕様としてではなく、将来方向を示す資料に基づく整理として扱う。

- 1.0: [OGC 3D Tiles 1.0](https://docs.ogc.org/cs/18-053r2/18-053r2.html)
- 1.1: [OGC 3D Tiles 1.1](https://docs.ogc.org/cs/22-025r4/22-025r4.html)
- 2.0方向: [2026 OGC Member Meeting Philly PDF](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 共通する骨格

版が変わっても、3D Tilesの基本的な役割は大きく変わらない。

- 3D空間データをタイル単位に分割して段階配信する
- 空間範囲とLODを使って、必要な部分だけを読む
- 1つの巨大モデルではなく、タイル木として全体を表現する

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

1.0から1.1への変化は、単なる機能追加ではなく、3D Tilesの重心を独自バイナリ形式からglTF中心へ移した点が大きい。

### コンテンツ形式

1.0では、主なタイル内容は `b3dm`、`i3dm`、`pnts`、`cmpt` だった。  
1.1ではglTF 2.0が主なタイル内容になり、これらのlegacy formatsは非推奨になった。  
この差分は、3Dコンテンツの表現をより一般的なglTFのエコシステムへ寄せる変化である。

- 1.1のtile formats: [OGC 3D Tiles 1.1, 6.8 Tile format specifications](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc36)
- version history: [CesiumGS 3d-tiles CHANGES.md](https://github.com/CesiumGS/3d-tiles/blob/main/CHANGES.md)

### メタデータ

1.0にも属性的な情報はあったが、表現力や構造化の面で制約が大きかった。  
1.1ではmetadataが大きく整理され、タイルセット、タイル、コンテンツ群など複数粒度に属性を結び付けやすくなった。

この差分は、単なる表示用データではなく、検索、選択、スタイリング、意味情報の保持を実装しやすくする点で重要である。

- metadataの位置づけ: [OGC 3D Tiles 1.1, 6.7 Metadata specification](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc35)

### 複数コンテンツ

1.0では1タイル1コンテンツに近い発想が強かった。  
1.1ではmultiple contentsに対応し、同じタイルに複数のコンテンツを持たせられる。

この差分は、同じ空間範囲に複数表現を重ねる設計や、レイヤー的な構成を取りやすくする。

- multiple contents: [OGC 3D Tiles 1.1, 6.4.1 Multiple contents](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc24)

### タイル木の表現

1.0では子タイルをJSONに明示列挙する構造が中心だった。  
1.1ではimplicit tilingが導入され、巨大なタイル木をよりコンパクトに表現できる。

この差分は、都市規模や全国規模の大きなデータで特に効く。子ノードをすべてJSONに書かずに済むため、配信量と管理コストを抑えやすい。

- implicit tiling: [OGC 3D Tiles 1.1, 6.8.2 Implicit tiles](https://docs.ogc.org/cs/22-025r4/22-025r4.html#toc39)

## 2.0 で議論されている方向

Cesiumの2026-03-03の資料では、`3D Tiles 2.0 - 3D Tiles baselined on glTF` と説明されている。  
ここで重要なのは、2.0を新しい独自形式として見るのではなく、3D TilesをglTF基盤で再整理する方向として捉えることである。

- 資料中の要約: [2026 OGC Member Meeting Philly PDF, p.4](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### glTF ベースライン化

資料では次の流れが示されている。

- 1.0: `b3dm` と `i3dm` がbinary glTFを包む
- 1.1: glTFをtile contentとして直接参照する
- 2.0: 3D TilesをglTF基盤で扱う

この流れは、3D Tilesの外側にglTFを置くのではなく、シーン表現そのものをglTFとより近い形で扱う方向を意味する。

### 複雑なシーン構造

資料では、2.0の主要な論点として次が並んでいる。

- bounding volume hierarchy
- level of detail
- external glTF references

これは、3D Tilesが得意としてきた空間階層やLODの考え方を、glTFのscene graphと近い形で扱いたい、という方向である。

たとえばexternal glTF referencesでは、複数のglTFアセットを外部参照で組み合わせてシーンを構成する例が示されている。level of detailでも、ノード単位で `refine` や `geometricError` を持つ構成例が出てくる。

- external referencesとLODの例: [2026 OGC Member Meeting Philly PDF, pp.7-9](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### 地理空間向け拡張

資料ではgeospatial extensionsとして次が挙げられている。

- region bounding volume
- S2 tiling scheme
- CRS / ellipsoid

これは、glTFをそのまま使うだけでは足りない地理空間特有の要件を、拡張として組み込む方向である。  
2.0の本質はglTFへの単純な吸収ではなく、glTFを基盤にしつつgeospatialな情報を足す点にある。

- geospatial extensionsの一覧: [2026 OGC Member Meeting Philly PDF, p.5](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

### 新しい対象データ

資料では、2.0方向で扱いたい対象として次の話題が続いている。

- voxel data
- time-dynamic 3D Tiles
- vector data support
- AEC extensions

つまり2.0は、建物やフォトグラメトリを配信するだけでなく、時系列、地下、設計モデル、3Dベクターデータまで含めた広い用途を見据えている。

- voxels: [2026 OGC Member Meeting Philly PDF, pp.14-18](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)
- time-dynamic: [2026 OGC Member Meeting Philly PDF, pp.20-23](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)
- vector support: [2026 OGC Member Meeting Philly PDF, pp.25-32](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 実装者への影響

実装の観点では、版ごとに見るべき場所が変わる。

1. 1.0を読む実装では、まずlegacy formatsのローダーとtileset JSONの対応関係を見る
2. 1.1を読む実装では、glTFローダーとmetadata、implicit tilingを分けて設計する
3. 2.0方向を追う実装では、glTF scene graphとgeospatial拡張をどう接続するかが主な論点になる

移行方針としては、新規実装では1.1を前提に設計し、1.0は互換対応として扱う方が整理しやすい。  
2.0は、すぐに全面移行先として決め打ちするより、glTF側のschema、拡張、サンプル実装の動きを追いながら評価する段階と見るのが妥当である。

## 注意点

- 1.0と1.1は確定済みのOGC Community Standard
- このページの2.0は、2026-03-03のCesium発表資料を元にした将来方向の整理
- 資料内でも `Continuing to support 3D Tiles 1.1 and tileset.json` とされており、1.1系の理解は引き続き重要

- roadmapの記述: [2026 OGC Member Meeting Philly PDF, p.12](https://cesium.cdn.prismic.io/cesium/aa9Mo1xvIZEnjgO3_2026_OGC_Member_Meeting_Philly.pdf)

## 関連概念

- [3D Tiles](/gis/data-formats/3d-tiles/)
- [glTF](/gis/data-formats/gltf/)
- [データフォーマット一覧](/gis/data-formats/)
