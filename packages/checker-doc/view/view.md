# 视图与视图元素

## 视图元素

"视图元素"定义了可以绘制在屏幕上的内容,接口定义如下:

```typescript
export interface IElement<TProps> {
  render(): boolean;
  getProps(): TProps;
  updateProps(props: TProps): boolean;
}
```

* render方法内通过调用上一节Canvas对象的一系列方法实现UI的绘制。
* getProps和updateProps可以获取/更新视图元素内部的自定义属性变量。

##### 元素实例：槽位

"槽位"是棋盘的基本组成部分，本项目中直接简化定义为在对应位置绘制一个圆，并且根据槽位的属性来定制对应的填充色。

例如绘制槽位外框代码如下:

```typescript
private renderSlot(): boolean {
  const props = this.getProps();
  const canvas = this.getCanvas();

  // 设置槽位边框的颜色
  if (!canvas.setColor(SLOT_COLOR_DICT[props.slotCategory])) {
    return false;
  }

  // 绘制边框圆圈
  return canvas.setFillMode('stroke').circle(props.coordinate, R_SLOT);
}
```

## 视图

视图继承与视图元素，同时内部包含了若干视图元素，可以简单的认为，视图是一种特殊的容器型，并渲染其所包含的所有视图元素对象。

视图对象在渲染时会依次调用各子元素的渲染方法，接口定义如下：

```typescript
export interface IView<T> extends IElement<T> {
  getChildren(): IElement<unknown>[];
}
```

##### 视图实例：棋盘

棋盘视图定义了棋盘基于ICanvas接口实现的若干方法，并接受绑定的点击事件。
