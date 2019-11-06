const puppeteer = require('puppeteer')

class PageScraper {
    constructor(url) {
        this.url = url
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
    }
    async load() {
        return this.page.goto(this.url)
    }
    async evaluate(evaluate, ...args) {
        return this.page.evaluate(evaluate, ...args)
    }
    async destroy() {
        this.browser.close()
        this.browser = this.page = null
    }
}

module.exports = PageScraper
