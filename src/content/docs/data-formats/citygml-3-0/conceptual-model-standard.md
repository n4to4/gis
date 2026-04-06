---
title: CityGML 3.0 Conceptual Model Standard
description: CityGML 3.0 Part 1で定義される概念モデル。UMLベースのモジュール、Space概念、LOD、時間表現、2.0との差分を整理する。
---

CityGML 3.0 Conceptual Model Standardとは、3D都市モデルを技術非依存の概念として定義するPart 1の標準。

## なぜ重要か

- XML要素名ではなく、都市モデルが何を表すべきかをUMLで定義している
- GML/XML、データベース、JSON系表現へ写像する前の基準になる
- 2.0で曖昧になりやすかった空間、LOD、時間変化、履歴管理の責務を整理できる
- 実装者にとっては、交換形式ではなく内部データモデルをどう設計するかの土台になる

## 何を表す標準か

Conceptual Model Standardの中心は、都市モデルのクラス、属性、関連、多重度、継承関係である。

| 観点 | 役割 | 実装時の見どころ |
| --- | --- | --- |
| UMLクラス | Building、Transportation、Versionなどの概念を定義する | どのクラスを内部モデルへ採用するかを決める |
| モジュール | 機能ごとに責務を分離する | 必要なモジュールだけ対象化できる |
| 関連・継承 | 地物どうしの包含、参照、特殊化を表す | XMLの親子構造に引きずられずに解釈できる |
| 空間モデル | Space、SpaceBoundary、Geometryの意味分担を定義する | 建物本体と面、部屋、交通空間を分けて保持できる |
| 時間モデル | 存続期間、時系列値、版管理の責務を切り分ける | 静的属性と履歴を別設計にできる |

## モジュール構成

Part 1は単一の巨大モデルではなく、複数モジュールの集合として設計されている。

| モジュール | 主な役割 | 代表的な論点 |
| --- | --- | --- |
| Core | 全体の基盤。識別、関連、時間属性、汎用地物を持つ | 他モジュールの共通基盤になる |
| Building | 建物、部位、境界面、開口部、部屋を扱う | 外形と屋内空間を切り分けやすい |
| Construction | 橋梁、トンネルなどの構築物共通概念を扱う | 建築物と土木構造物の共通部分を再利用できる |
| Transportation | 道路、鉄道、広場、交通空間を扱う | 路面と交通空間の意味を分けやすい |
| Relief | 地形や地表面を扱う | 都市地物と地形の接続を整理できる |
| Versioning | 版、遷移、履歴系列を扱う | 上書き更新以外のモデルを持てる |
| Dynamizer | 属性やジオメトリへの時系列値付与を扱う | センサーデータ連携に効く |

## Space概念

CityGML 3.0 Part 1の大きな特徴は、都市地物をSpaceとSpace Boundaryの考え方で整理する点にある。

- Spaceは体積を持つ実世界の対象を表す
- Space BoundaryはSpaceを区切る面を表す
- Building、Room、TrafficSpace、水域などはSpaceとして理解できる
- WallSurface、RoofSurface、GroundSurfaceなどはSpace Boundaryとして理解できる

この整理により、建物本体、部屋、路面、境界面を同じ「地物」の一種として雑に扱わずに済む。2.0でも似た表現はあったが、3.0ではこれが概念モデルの中心へ引き上げられている。

## LODの考え方

Part 1では、LODを単なる描画品質ではなく、対象をどの粒度で記述するかの規約として整理する。

- 3.0のLODは LOD0〜LOD3 の4段階で定義される
- 屋外表現と屋内表現を別文脈で扱いやすい
- 2.0のLOD4に対応していた屋内情報は、3.0ではSpace概念と組み合わせて表現する
- 同一地物が複数LODを同時に持てる前提は維持される

実装では、LOD番号だけを保持するより、「どの空間表現が」「どの用途向けの粒度で」存在するかを明示した方が後工程に強い。

## 時間表現

Part 1では、時間に関する責務を複数の層に分けている。

| 種類 | 概念 | 何を表すか |
| --- | --- | --- |
| 存続期間 | creation / termination | 地物や版がいつ有効か |
| 時系列変化 | Dynamizer | 属性値やジオメトリの連続変化 |
| 履歴管理 | Versioning | 変更前後の版、分岐、遷移 |

この切り分けにより、たとえば「建物は同一実体だが、2024年版と2025年版で属性が違う」という状況を、センサーの時系列変化と混同せずに扱える。

## 2.0との違い

| 観点 | CityGML 2.0 | CityGML 3.0 Part 1 |
| --- | --- | --- |
| 標準の主役 | GML/XML要素とスキーマ | UMLベースの概念モデル |
| LOD | 0〜4で理解されることが多い | 0〜3に整理される |
| 屋内表現 | LOD4へ強く依存 | Space概念で整理 |
| 時間変化 | 標準の中心ではない | DynamizerとVersioningで明確化 |
| 実装視点 | XMLパース中心になりやすい | 内部モデル設計を先に考えやすい |

## 読み方

Part 1を読むときは、次の順が追いやすい。

1. Coreの基本クラスと識別の考え方を読む
2. SpaceとSpace Boundaryの関係を理解する
3. LODと空間表現の関係を確認する
4. 対象モジュールのクラス図を見る
5. 最後にVersioningとDynamizerを読み、時間変化の責務を分ける

## 実装で見るポイント

- UML上の継承と関連を、そのままクラス設計へ写すか、用途別に正規化するかを決める必要がある
- XML文書の親子構造だけでデータモデルを決めると、Part 1の意図を取りこぼしやすい
- Space概念を無視すると、屋内表現や境界面の意味が曖昧になる
- Versioningを使うなら、単純な最新値上書き型スキーマでは不足しやすい
- Dynamizerを使うなら、時系列DBや別テーブルへの切り出しを最初から検討した方がよい

## 具体例

Conceptual Model Standardの考え方を内部モデルへ落とすと、次のような分解になる。

```txt
Building
  identifiers
  attributes
  spaces
  spaceBoundaries
  geometriesByLod
  versions
  dynamizers
```

この例では、1つの建物を単一レコードとして扱うのではなく、識別、空間、境界、LOD、履歴、時系列を別責務として保持している。これがPart 1を読むときの基本姿勢になる。

## 制約・注意点

- Part 1だけ読んでも、実際のXML要素名やXSD構成は分からない
- 逆にXML断片だけ見ても、Part 1の概念整理を知らないと責務を誤認しやすい
- すべての実装が全モジュールを同じ深さでサポートするわけではない
- ADEを含む拡張では、標準クラスとの関係を明示しないと解釈が揺れやすい

## 公式仕様・一次情報

- [OGC CityGML 3.0 Part 1: Conceptual Model Standard](https://docs.ogc.org/is/20-010/20-010.html)
- [OGC CityGML 3.0 Conceptual Model Users Guide](https://docs.ogc.org/guides/20-066.html)

## 関連概念

- [CityGML 3.0](/gis/data-formats/citygml-3-0/)
- [CityGML 3.0 GML Encoding Standard](/gis/data-formats/citygml-3-0/gml-encoding-standard/)
- [CityGML 2.0のLOD](/gis/citygml-2-0/lod/)
