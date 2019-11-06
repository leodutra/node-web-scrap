const puppeteer = require('puppeteer')

class PageScraper {
    constructor(url) {
        this.url = url
        this.browser = null
        this.page = null
    }
    async load(onPageLoad) {
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        if (typeof onPageLoad == 'function') {
            this.page.on('load', onPageLoad)
        }
        return this.page.goto(this.url)
    }
    async evaluate(evaluate, ...args) {
        if (!this.page) {
            throw new Error(`Please ${this.load.name}() ${PageScraper.name} before calling ${this.evaluate.name}().`)
        }
        return this.page.evaluate(evaluate, ...args)
    }
    async unload() {
        if (this.browser) {
            this.browser.close()
        }
        this.browser = this.page = null
    }
}

module.exports = PageScraper
