/**
 * AI图片生成提示词管理
 * 用于生成炉石传说卡牌的原画，而非完整的卡牌样式
 */

const ImagePrompts = {
	/**
	 * 生成基础原画提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @returns {string} 图片生成提示词
	 */
	generateArtworkPrompt(cardName, description = "") {
		// 只生成原画，不包含卡牌框架和UI元素
		return `Create a fantasy artwork of ${cardName}. ${description}. 
High quality digital painting, fantasy art style, detailed illustration, 
vibrant colors, magical atmosphere, epic fantasy scene, 
character portrait or creature art, no card frame, no UI elements, 
just the pure artwork suitable for a trading card game illustration.`;
	},

	/**
	 * 生成角色原画提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @returns {string} 角色原画提示词
	 */
	generateCharacterArtPrompt(cardName, description = "") {
		return `Fantasy character artwork of ${cardName}. ${description}. 
Detailed character portrait, epic fantasy style, digital painting, 
vibrant colors, magical lighting, heroic pose, 
no background distractions, focus on the character, 
suitable for trading card game artwork.`;
	},

	/**
	 * 生成生物原画提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @returns {string} 生物原画提示词
	 */
	generateCreatureArtPrompt(cardName, description = "") {
		return `Fantasy creature artwork of ${cardName}. ${description}. 
Detailed creature illustration, epic fantasy style, digital art, 
vibrant colors, dramatic lighting, dynamic pose, 
fantasy environment background, magical atmosphere, 
suitable for trading card game creature art.`;
	},

	/**
	 * 生成法术效果原画提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @returns {string} 法术效果原画提示词
	 */
	generateSpellArtPrompt(cardName, description = "") {
		return `Magical spell effect artwork of ${cardName}. ${description}. 
Dynamic magical effects, energy swirls, glowing particles, 
vibrant magical colors, fantasy spell visualization, 
epic magical scene, dramatic lighting effects, 
suitable for trading card game spell artwork.`;
	},

	/**
	 * 生成武器原画提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @returns {string} 武器原画提示词
	 */
	generateWeaponArtPrompt(cardName, description = "") {
		return `Fantasy weapon artwork of ${cardName}. ${description}. 
Detailed weapon illustration, masterwork craftsmanship, intricate design, 
magical enchantments, glowing runes, mystical aura, 
ornate decorations, legendary weapon, epic fantasy style, 
vibrant metallic textures, magical lighting effects, 
no character holding it, focus on the weapon itself, 
suitable for trading card game weapon artwork.`;
	},

	/**
	 * 根据卡牌类型自动选择合适的提示词
	 * @param {string} cardName - 卡牌名称
	 * @param {string} description - 卡牌描述
	 * @param {string} cardType - 卡牌类型 (MINION, SPELL, WEAPON)
	 * @returns {string} 图片生成提示词
	 */
	getPromptByType(cardName, description = "", cardType = "MINION") {
		switch (cardType.toUpperCase()) {
			case "SPELL":
				return this.generateSpellArtPrompt(cardName, description);
			case "WEAPON":
				return this.generateWeaponArtPrompt(cardName, description);
			case "MINION":
			default:
				return this.generateCreatureArtPrompt(cardName, description);
		}
	},
};

// 导出模块
if (typeof module !== "undefined" && module.exports) {
	module.exports = ImagePrompts;
} else if (typeof window !== "undefined") {
	window.ImagePrompts = ImagePrompts;
}
