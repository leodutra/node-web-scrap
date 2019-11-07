const got = require('got')
const cheerio = require('cheerio')
const { decodeHTMLEntities, replaceHTMLTags } = require('node-utils')

class SourceScraper {
    constructor(url, { cookieJar, form } = {}) {
        this.url = new URL(url)
        this.cookieJar = cookieJar
        this.form = form
    }
    
    static sanitizeHTMLText(text) {
        if (text !== 'string') return text
        return replaceHTMLTags(decodeHTMLEntities(text))
            .split(/\r?\n/m)
                .map(x => x.trim().replace(/(\s)+/gim, '\u0020'))
                .join('\n')
            .replace(/(\r?\n)+/gm, '$1')
            .trim()
    }

    sanitizeHTMLText(text) { return WebPage.sanitizeHTMLText(text) }

    sanitizeBackgroundURLCSS(cssText) {
        if (typeof cssText === 'string') return cssText
        return cssText.replace(/\burl\(['"]?([^)]+?)['"]?\)/, '$1')
    }

    async load({ relativeUrl } = {}) {
        const url = new URL(relativeUrl || '', this.url)
        this._cheerio = cheerio.load(
            (await got(url, { 
                cookieJar: this.cookieJar,
                method: this.form ? 'POST' : 'GET',
                body: this.form,
                form: !!this.form
            })).body
        )
        return this
    }
    
    get $() {
        if (this._cheerio) {
            return this._cheerio
        }
        throw new Error(
            `You need to ${this.load.name}() the <${WebPage.name}> before any query.`
        )
    }
    
    relativeURL(url) {
        return new URL(url, this.url).toString()
    }
}

module.exports = SourceScraper
