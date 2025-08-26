/**
 * 国际化系统核心模块
 * 支持多语言切换和翻译功能
 */
class I18n {
    constructor() {
        this.currentLanguage = 'zh-CN';
        this.translations = {};
        this.supportedLanguages = {
            'zh-CN': '简体中文',
            'zh-TW': '繁體中文',
            'en-US': 'English',
            'ja-JP': '日本語',
            'ko-KR': '한국어'
        };
        this.fallbackLanguage = 'en-US';
        
        // 从localStorage加载用户偏好语言
        this.loadUserPreference();
    }

    /**
     * 加载用户语言偏好
     */
    loadUserPreference() {
        const savedLanguage = localStorage.getItem('hearthstone-card-generator-language');
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            // 尝试检测浏览器语言
            const browserLanguage = this.detectBrowserLanguage();
            if (browserLanguage) {
                this.currentLanguage = browserLanguage;
            }
        }
    }

    /**
     * 检测浏览器语言
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // 精确匹配
        if (this.supportedLanguages[browserLang]) {
            return browserLang;
        }
        
        // 模糊匹配（例如 zh 匹配 zh-CN）
        const langCode = browserLang.split('-')[0];
        const matchedLang = Object.keys(this.supportedLanguages).find(lang => 
            lang.startsWith(langCode)
        );
        
        return matchedLang || null;
    }

    /**
     * 异步加载语言文件
     */
    async loadLanguage(language) {
        if (this.translations[language]) {
            return this.translations[language];
        }

        try {
            const response = await fetch(`./i18n/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${language}`);
            }
            
            const translations = await response.json();
            this.translations[language] = translations;
            return translations;
        } catch (error) {
            console.error(`Error loading language ${language}:`, error);
            
            // 如果加载失败且不是回退语言，尝试加载回退语言
            if (language !== this.fallbackLanguage) {
                return await this.loadLanguage(this.fallbackLanguage);
            }
            
            throw error;
        }
    }

    /**
     * 切换语言
     */
    async switchLanguage(language) {
        if (!this.supportedLanguages[language]) {
            console.warn(`Unsupported language: ${language}`);
            return false;
        }

        try {
            await this.loadLanguage(language);
            this.currentLanguage = language;
            
            // 保存用户偏好
            localStorage.setItem('hearthstone-card-generator-language', language);
            
            // 触发语言切换事件
            this.dispatchLanguageChangeEvent();
            
            return true;
        } catch (error) {
            console.error(`Failed to switch to language ${language}:`, error);
            return false;
        }
    }

    /**
     * 触发语言切换事件
     */
    dispatchLanguageChangeEvent() {
        const event = new CustomEvent('languageChanged', {
            detail: {
                language: this.currentLanguage,
                translations: this.translations[this.currentLanguage]
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 添加事件监听器
     */
    on(eventName, callback) {
        document.addEventListener(eventName, callback);
    }

    /**
     * 移除事件监听器
     */
    off(eventName, callback) {
        document.removeEventListener(eventName, callback);
    }

    /**
     * 获取翻译文本
     * @param {string} key - 翻译键，支持点号分隔的嵌套键
     * @param {object} params - 替换参数
     * @param {string} language - 指定语言（可选）
     */
    t(key, params = {}, language = null) {
        const lang = language || this.currentLanguage;
        const translations = this.translations[lang];
        
        if (!translations) {
            console.warn(`Translations not loaded for language: ${lang}`);
            return key;
        }

        // 支持嵌套键（例如 'ui.title'）
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // 如果当前语言没有找到，尝试回退语言
                if (lang !== this.fallbackLanguage && this.translations[this.fallbackLanguage]) {
                    return this.t(key, params, this.fallbackLanguage);
                }
                
                console.warn(`Translation key not found: ${key} for language: ${lang}`);
                return key;
            }
        }

        if (typeof value !== 'string') {
            console.warn(`Translation value is not a string: ${key}`);
            return key;
        }

        // 替换参数
        return this.interpolate(value, params);
    }

    /**
     * 字符串插值
     */
    interpolate(template, params) {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * 获取当前语言
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 获取支持的语言列表
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * 初始化国际化系统
     */
    async init() {
        try {
            await this.loadLanguage(this.currentLanguage);
            console.log(`I18n initialized with language: ${this.currentLanguage}`);
            return true;
        } catch (error) {
            console.error('Failed to initialize I18n:', error);
            return false;
        }
    }

    /**
     * 更新页面中所有带有 data-i18n 属性的元素
     */
    updatePageTranslations() {
        // 处理 data-i18n 属性
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // 处理 data-i18n-placeholder 属性
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            element.placeholder = translation;
        });
    }

    /**
     * 获取关键词翻译（用于关键词加粗功能）
     */
    getKeywords(language = null) {
        const lang = language || this.currentLanguage;
        const translations = this.translations[lang];
        
        if (translations && translations.keywords) {
            return translations.keywords;
        }
        
        // 回退到默认语言
        if (lang !== this.fallbackLanguage && this.translations[this.fallbackLanguage]) {
            return this.getKeywords(this.fallbackLanguage);
        }
        
        return {};
    }
}

// 创建全局实例
window.i18n = new I18n();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}