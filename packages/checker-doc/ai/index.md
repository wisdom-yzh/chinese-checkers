# ai层

ai模块定义了预测某个阵营行棋的接口，并提供了三种实现，用于人机对战和智能行棋提示;

行棋接口定义如下:

```typescript
import { FactionIdentity, MoveStep } from 'checker-model';

interface IPredictor {
  predict(id: FactionIdentity): MoveStep | null;
}
```
