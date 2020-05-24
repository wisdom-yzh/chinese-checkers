# 游戏与玩家

## 游戏

定义了跳棋的基本功能与当前状态,包含以下属性:

* 玩家及所在位置
* 棋盘以及棋子
* 游戏状态包括以下属性:
  + 是否正在运行中
  + 当前行棋玩家
  + 玩家行棋轨迹
  + 玩家是否胜利

游戏对象的接口定义如下：

```typescript
type GameStatus = 'preparing' | 'running' | 'end';

interface IGameModel {
  /**
   * reset and init the game
   */
  reset(factionIdentities: FactionIdentity[]): IGameModel;

  /**
   * reset by specialied faction
   */
  resetByFaction(factions: IFaction[]): IGameModel;

  /**
   * start the game
   */
  start(): boolean;

  /**
   * get current game status
   */
  getStatus(): GameStatus;

  /**
   * update current game status
   */
  updateStatus(): GameStatus;

  /**
   * rollback game status
   */
  rollbackByStep(step: number): boolean;

  /**
   * get current player
   */
  getCurrentPlayer(): Player;

  /**
   * get board
   */
  getBoard(): IBoard;

  /**
   * get player by faction id
   */
  getPlayerByFactionId(id: FactionIdentity): Player | undefined;
}
```

## 玩家

玩家对象拥有以下属性:

* 是否已经胜利(即走完所有棋子)
* 玩家的阵营(即棋盘中的位置,具体定义见下一节"阵营")

玩家对象结构如下:

```typescript
type PlayerStatus = 'playing' | 'win';

type Player = {
  /**
   * current status of player
   */
  status: PlayerStatus;

  /**
   * player's faction properties
   */
  faction: IFaction;
};
```
