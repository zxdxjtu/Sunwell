# Sunwell AI卡牌生成器 - 后端接口文档

## 概述

本文档描述了Sunwell AI炉石传说卡牌生成器所使用的后端API接口。系统主要依赖Google Gemini API来实现AI驱动的卡牌生成和图片生成功能。

---

## 核心API服务

### 1. Google Gemini API

#### 基础配置
- **API提供商**: Google Generative AI
- **主要模型**: gemini-1.5-flash-latest
- **图片生成模型**: gemini-2.0-flash-preview-image-generation
- **认证方式**: API Key认证

#### API密钥配置
```javascript
// 安全的API密钥配置方式
const GEMINI_API_KEY = getApiKey();

function getApiKey() {
    // 1. 从环境变量获取 (推荐生产环境)
    if (process.env.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
    }
    
    // 2. 从本地存储获取 (用户手动设置)
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) return storedKey;
    
    // 3. 提示用户输入
    const userKey = prompt('请输入您的Gemini API密钥:');
    if (userKey) {
        localStorage.setItem('GEMINI_API_KEY', userKey);
        return userKey;
    }
    
    throw new Error('未找到API密钥');
}
```

**环境变量配置** (推荐):
```bash
# .env 文件
GEMINI_API_KEY=your_actual_api_key_here
```

---

## 接口详细说明

### 1. 卡牌生成接口

#### 1.1 文本生成接口

**接口地址**:
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}
```

**请求方式**: POST

**请求头**:
```javascript
{
    'Content-Type': 'application/json'
}
```

**请求参数**:
```javascript
{
    contents: [{
        parts: [{
            text: "用户输入的卡牌创意描述"
        }]
    }],
    generationConfig: {
        temperature: 0.8,      // 创意度设置 (0.0-1.0)
        maxOutputTokens: 1000, // 最大输出token数
        topP: 0.9,            // 核心采样参数
        topK: 40              // 候选词数量限制
    }
}
```

**响应格式**:
```javascript
{
    candidates: [{
        content: {
            parts: [{
                text: "{\n  \"name\": \"卡牌名称\",\n  \"text\": \"<b>关键词:</b> 卡牌效果描述\",\n  \"attack\": 4,\n  \"health\": 5,\n  \"cost\": 3,\n  \"cardClass\": \"MAGE\",\n  \"rarity\": \"RARE\",\n  \"type\": \"MINION\",\n  \"race\": \"ELEMENTAL\"\n}"
            }]
        }
    }]
}
```

**使用示例** (`ai_generator.html:1482-1510`):
```javascript
const response = await fetch(GEMINI_API_URL + '?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: userPrompt
            }]
        }],
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40
        }
    })
});
```

#### 1.2 图片生成接口 (卡牌艺术画)

**接口地址**:
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key={API_KEY}
```

**请求参数**:
```javascript
{
    contents: [{
        parts: [{
            text: "Hearthstone card art: [艺术描述], high quality digital art, fantasy style, detailed illustration"
        }]
    }],
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.95,
        topK: 20
    }
}
```

**响应格式**:
```javascript
{
    candidates: [{
        content: {
            parts: [{
                inlineData: {
                    mimeType: "image/png",
                    data: "base64编码的图片数据"
                }
            }]
        }
    }]
}
```

**使用示例** (`ai_generator.html:1604-1635`):
```javascript
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: `Hearthstone card art: ${artDescription}, high quality digital art, fantasy style, detailed illustration`
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.95,
            topK: 20
        }
    })
});
```

---

## 错误处理机制

### 1. API错误类型

#### 1.1 网络错误
- **错误类型**: `Failed to fetch`
- **触发条件**: 网络连接失败、DNS解析失败
- **处理方式**: 自动启用离线模式，使用预定义卡牌模板

#### 1.2 API响应错误
- **错误类型**: HTTP状态码非200
- **触发条件**: API限流、认证失败、服务不可用
- **处理方式**: 显示具体错误信息并提供重试选项

#### 1.3 超时错误
- **错误类型**: 请求超时
- **默认超时**: 30秒
- **处理方式**: 启用本地备用卡牌生成

### 2. 错误处理代码示例

```javascript
try {
    const response = await fetch(GEMINI_API_URL + '?key=' + GEMINI_API_KEY, requestOptions);
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
    
} catch (error) {
    if (error.name === 'AbortError') {
        console.log('🔧 API超时，使用本地备用卡牌');
        return getFallbackCard();
    } else if (error.message.includes('Failed to fetch')) {
        console.log('🌐 网络连接失败，启用离线模式');
        return getOfflineCard();
    } else {
        console.error('API调用失败:', error);
        throw error;
    }
}
```

---

## 多语言支持

### 支持的语言
- 🇨🇳 中文 (zh-CN) - 默认
- 🇺🇸 英文 (en-US)
- 🇯🇵 日文 (ja-JP)  
- 🇰🇷 韩文 (ko-KR)
- 🇹🇼 繁体中文 (zh-TW)

### 语言特殊处理

#### 韩语文本优化 (`ai_generator.html:598-610`)
```javascript
if (isKoreanText) {
    if (cleanTextLength > 60) {
        adjustedCharsPerLine = 14;  // 超长文本
        maxLines = 5;
    } else if (cleanTextLength > 40) {
        adjustedCharsPerLine = 15;  // 中等文本
        maxLines = 4;
    } else {
        adjustedCharsPerLine = 16;  // 短文本
        maxLines = 3;
    }
}
```

#### 关键词映射系统
```javascript
const keywordMappings = {
    'zh-CN': {
        'battlecry': '战吼',
        'deathrattle': '亡语',
        'taunt': '嘲讽'
    },
    'ko-KR': {
        'battlecry': '전투의 함성',
        'deathrattle': '죽음의 메아리',
        'taunt': '도발'
    },
    'en-US': {
        'battlecry': 'Battlecry',
        'deathrattle': 'Deathrattle',
        'taunt': 'Taunt'
    }
};
```

---

## 性能优化

### 1. 请求优化
- **超时控制**: 30秒超时机制防止长时间等待
- **错误重试**: 网络错误自动切换到离线模式
- **响应缓存**: 生成的卡牌数据临时缓存

### 2. 图片处理
- **懒加载**: 卡牌艺术画按需生成
- **格式优化**: 使用PNG格式保证质量
- **Base64编码**: 直接嵌入HTML避免额外请求

### 3. 文本处理优化
```javascript
// 韩语文本专项优化
const processKoreanText = (text) => {
    // Unicode范围检测
    const koreanRegex = /[\uac00-\ud7af]/;
    const isKorean = koreanRegex.test(text);
    
    if (isKorean) {
        // 字符数优化
        return optimizeKoreanLayout(text);
    }
    
    return text;
};
```

---

## 安全性考虑

### 1. API密钥管理
- **前端暴露**: 当前为演示用途，生产环境需要后端代理
- **权限限制**: 建议设置API配额限制
- **密钥轮换**: 定期更换API密钥

### 2. 输入验证
```javascript
// 用户输入验证
const validateInput = (input) => {
    if (!input || input.trim().length === 0) {
        throw new Error('输入内容不能为空');
    }
    
    if (input.length > 1000) {
        throw new Error('输入内容过长，请限制在1000字符内');
    }
    
    return input.trim();
};
```

### 3. 内容过滤
- **恶意内容**: 防止生成不当内容
- **格式验证**: 确保返回的JSON格式正确
- **数据清理**: 移除潜在的XSS攻击向量

---

## 部署配置

### 1. 环境要求
- **Web服务器**: 支持HTTPS的Web服务器
- **API访问**: 需要能够访问Google Gemini API
- **域名配置**: 建议配置CORS策略

### 2. 配置文件
```javascript
// 生产环境配置
const CONFIG = {
    API_BASE_URL: 'https://your-api-proxy.com',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    CACHE_DURATION: 300000 // 5分钟
};
```

### 3. 监控和日志
```javascript
// API调用监控
const logAPICall = (endpoint, duration, success) => {
    console.log(`API调用: ${endpoint}, 耗时: ${duration}ms, 成功: ${success}`);
    
    // 生产环境中应该发送到监控系统
    if (typeof analytics !== 'undefined') {
        analytics.track('api_call', {
            endpoint,
            duration,
            success
        });
    }
};
```

---

## 故障排除

### 常见问题

#### 1. API密钥无效
**错误信息**: `API请求失败: 400 - API key not valid`
**解决方案**: 检查API密钥是否正确，是否有相应权限

#### 2. 网络连接失败
**错误信息**: `Failed to fetch`
**解决方案**: 检查网络连接，确认防火墙设置

#### 3. 响应格式错误
**错误信息**: `JSON解析失败`
**解决方案**: 检查API响应内容，可能需要调整prompt

#### 4. 韩语文本显示问题
**症状**: 文本溢出或换行异常
**解决方案**: 检查字符限制设置和字体配置

---

## 更新日志

### v1.2.0 (最新)
- ✅ 完善韩语文本渲染支持
- ✅ 优化标点符号处理机制
- ✅ 修复JavaScript变量赋值错误
- ✅ 添加关键词高亮功能

### v1.1.0
- ✅ 集成Gemini图片生成API
- ✅ 添加多语言支持
- ✅ 实现错误重试机制

### v1.0.0
- ✅ 基础卡牌生成功能
- ✅ Gemini API集成
- ✅ 离线模式支持