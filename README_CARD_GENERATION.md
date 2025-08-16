# 炉石传说卡牌Canvas生成指南

## 项目简介

本项目使用 **Sunwell** 库来生成高质量的炉石传说卡牌图像。Sunwell 是一个专门为炉石传说卡牌渲染而设计的 Canvas 库，能够生成与游戏内卡牌完全一致的视觉效果。

### Sunwell 库特性

- 🎨 **高质量渲染**：生成与炉石传说游戏内完全一致的卡牌图像
- 🖼️ **完整资源支持**：包含所有官方卡牌框架、宝石、装饰元素
- 🎯 **多种卡牌类型**：支持随从、法术、武器、英雄等所有卡牌类型
- 💎 **稀有度系统**：完整支持普通、稀有、史诗、传说稀有度
- 🏛️ **职业系统**：支持所有职业的专属卡牌框架和颜色
- 🐉 **种族支持**：支持龙族、野兽、恶魔等所有种族标识

## 安装和设置

### 方法一：使用 CDN（推荐）

```html
<script src="https://unpkg.com/sunwell@latest/dist/sunwell.js"></script>
```

### 方法二：本地构建

1. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd Sunwell
npm install
```

2. 构建项目：
```bash
npm run build
```

3. 在 HTML 中引入构建后的文件：
```html
<script src="./dist/sunwell.js"></script>
```

## 基本用法

### 1. HTML 结构

```html
<!DOCTYPE html>
<html>
<head>
    <title>炉石传说卡牌生成</title>
</head>
<body>
    <!-- 卡牌容器 -->
    <canvas id="cardCanvas" width="400" height="600"></canvas>
    
    <!-- 引入 Sunwell 库 -->
    <script src="https://unpkg.com/sunwell@latest/dist/sunwell.js"></script>
    <script>
        // 你的卡牌生成代码
    </script>
</body>
</html>
```

### 2. 初始化 Sunwell

```javascript
// 创建 Sunwell 实例
const sunwell = new Sunwell({
    assetFolder: 'https://unpkg.com/sunwell@latest/assets/',
    titleFont: 'Belwe',
    bodyFont: 'Franklin Gothic',
    debug: false
});
```

### 3. 生成卡牌

```javascript
// 卡牌数据
const cardData = {
    id: 'CARD_001',
    name: '龙王玛里苟斯',
    text: '<b>战吼：</b>将5张法术伤害+2的法术牌置入你的手牌。',
    cost: 9,
    attack: 4,
    health: 12,
    cardClass: 'NEUTRAL',
    rarity: 'LEGENDARY',
    type: 'MINION',
    race: 'DRAGON',
    set: 'EXPERT1',
    collectible: true,
    elite: true
};

// 获取 Canvas 元素
const canvas = document.getElementById('cardCanvas');

// 渲染卡牌
sunwell.createCard(
    cardData,
    400,  // 卡牌宽度
    false, // 是否为高级版本
    canvas, // Canvas 元素
    function() {
        console.log('卡牌渲染完成！');
    }
);
```

## 卡牌数据格式说明

### 必需字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | string | 卡牌唯一标识符 | `"CARD_001"` |
| `name` | string | 卡牌名称 | `"龙王玛里苟斯"` |
| `type` | string | 卡牌类型 | `"MINION"`, `"SPELL"`, `"WEAPON"` |
| `cardClass` | string | 卡牌职业 | `"MAGE"`, `"WARRIOR"`, `"NEUTRAL"` |
| `rarity` | string | 稀有度 | `"COMMON"`, `"RARE"`, `"EPIC"`, `"LEGENDARY"` |

### 随从卡牌字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `cost` | number | 法力值消耗 | `9` |
| `attack` | number | 攻击力 | `4` |
| `health` | number | 生命值 | `12` |
| `text` | string | 卡牌描述文本 | `"<b>战吼：</b>效果描述"` |
| `race` | string | 种族（可选） | `"DRAGON"`, `"BEAST"`, `"DEMON"` |

### 法术卡牌字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `cost` | number | 法力值消耗 | `3` |
| `text` | string | 法术效果描述 | `"造成3点伤害"` |

### 武器卡牌字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `cost` | number | 法力值消耗 | `5` |
| `attack` | number | 攻击力 | `3` |
| `durability` | number | 耐久度 | `2` |
| `text` | string | 武器效果描述 | `"你的英雄获得+1攻击力"` |

## 高级配置选项

### Sunwell 实例配置

```javascript
const sunwell = new Sunwell({
    // 资源文件夹路径
    assetFolder: 'https://unpkg.com/sunwell@latest/assets/',
    
    // 字体配置
    titleFont: 'Belwe',           // 卡牌名称字体
    bodyFont: 'Franklin Gothic',   // 描述文本字体
    
    // 调试模式
    debug: false,
    
    // 缓存设置
    cacheSkeleton: true,
    
    // 渲染质量
    quality: 'high'
});
```

### 卡牌渲染选项

```javascript
sunwell.createCard(
    cardData,
    400,        // 卡牌宽度
    false,      // 是否为高级版本（金卡）
    canvas,     // Canvas 元素
    callback,   // 完成回调函数
    {
        // 额外选项
        locale: 'zhCN',     // 语言设置
        resolution: 2,      // 分辨率倍数
        background: true    // 是否显示背景
    }
);
```

## 完整示例

### 生成多张不同类型的卡牌

```javascript
// 卡牌数据数组
const cards = [
    {
        id: 'LEGENDARY_001',
        name: '龙王玛里苟斯',
        text: '<b>战吼：</b>将5张法术伤害+2的法术牌置入你的手牌。',
        cost: 9,
        attack: 4,
        health: 12,
        cardClass: 'NEUTRAL',
        rarity: 'LEGENDARY',
        type: 'MINION',
        race: 'DRAGON'
    },
    {
        id: 'EPIC_001',
        name: '暮光守护者',
        text: '<b>嘲讽</b>\n<b>战吼：</b>如果你的手牌中有龙牌，获得+1攻击力。',
        cost: 4,
        attack: 2,
        health: 4,
        cardClass: 'NEUTRAL',
        rarity: 'EPIC',
        type: 'MINION',
        race: 'DRAGON'
    },
    {
        id: 'SPELL_001',
        name: '火球术',
        text: '造成6点伤害。',
        cost: 4,
        cardClass: 'MAGE',
        rarity: 'COMMON',
        type: 'SPELL'
    }
];

// 渲染所有卡牌
cards.forEach((cardData, index) => {
    const canvas = document.getElementById(`card${index}`);
    sunwell.createCard(cardData, 400, false, canvas, () => {
        console.log(`卡牌 ${cardData.name} 渲染完成`);
    });
});
```

## 常见问题解决方案

### Q1: 卡牌显示空白或加载失败

**解决方案：**
1. 检查网络连接，确保能访问 CDN 资源
2. 确认 Canvas 元素存在且尺寸正确
3. 检查卡牌数据格式是否正确
4. 在浏览器开发者工具中查看错误信息

### Q2: 字体显示异常

**解决方案：**
1. 确保字体文件正确加载
2. 检查字体名称拼写
3. 使用 Web 安全字体作为备选

### Q3: 资源加载缓慢

**解决方案：**
1. 使用本地资源文件
2. 启用浏览器缓存
3. 使用 CDN 加速

### Q4: 卡牌文本格式问题

**解决方案：**
1. 使用正确的 HTML 标签：`<b>` 表示粗体
2. 使用 `\n` 表示换行
3. 确保特殊字符正确转义

### Q5: 移动端显示问题

**解决方案：**
1. 设置合适的 viewport
2. 使用响应式设计
3. 调整 Canvas 尺寸适配屏幕

## 技术支持

- **官方文档**：[Sunwell GitHub](https://github.com/HearthSim/Sunwell)
- **问题反馈**：在 GitHub Issues 中提交问题
- **社区讨论**：加入炉石传说开发者社区

## 许可证

本项目遵循 MIT 许可证。详情请查看 LICENSE 文件。

---

**注意**：本工具仅用于学习和开发目的，请遵守暴雪娱乐的相关条款和政策。