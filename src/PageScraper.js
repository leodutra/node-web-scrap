class PageScraper {
    constructor(url, browser) {
        this.url = url
        this.browser = browser
        this.page = null
    }
    async load(opts = {}) {
        const { onPageLoad } = opts
        this.page = await this.browser.newPage()
        if (onPageLoad) {
            this.page.on('load', onPageLoad)
        }
        return this.page.goto(this.url, opts)
    }
    async evaluate(evaluate, ...args) {
        if (!this.page) {
            throw new Error(`Please ${this.load.name}() ${PageScraper.name} before calling ${this.evaluate.name}().`)
        }
        return this.page.evaluate(evaluate, ...args)
    }
    async scrap(waitForSelector, evaluate, ...args) {
        await this.load()
        if (waitForSelector) {
            await this.page.waitForSelector(waitForSelector)
        }
        const result = await this.evaluate(evaluate, ...args)
        await this.unload()
        return result
    }
    async unload() {
        if (this.page) {
            await this.page.close()
            this.page = null
        }
    }
}

module.exports = PageScraper
