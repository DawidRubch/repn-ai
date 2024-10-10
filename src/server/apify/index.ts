import { ApifyClient } from "apify-client";
import { env } from "../../env";

export const client = new ApifyClient({
    token: env.APIFY_TOKEN,
});


export const getApifyInput = (urls: string[]) => {
    return {
        "startUrls": urls.map(url => ({ "url": url })),
        "useSitemaps": false,
        "crawlerType": "playwright:adaptive",
        "includeUrlGlobs": [],
        "excludeUrlGlobs": [],
        "keepUrlFragments": false,
        "ignoreCanonicalUrl": false,
        "maxCrawlDepth": 2,
        "maxCrawlPages": 100,
        "initialConcurrency": 0,
        "initialCookies": [],
        "proxyConfiguration": {
            "useApifyProxy": true
        },
        "maxSessionRotations": 10,
        "maxRequestRetries": 5,
        "requestTimeoutSecs": 60,
        "minFileDownloadSpeedKBps": 128,
        "dynamicContentWaitSecs": 10,
        "waitForSelector": "",
        "maxScrollHeightPixels": 5000,
        "removeElementsCssSelector": `nav, footer, script, style, noscript, svg,
            [role="alert"],
            [role="banner"],
            [role="dialog"],
            [role="alertdialog"],
            [role="region"][aria-label*="skip" i],
            [aria-modal="true"]`,
        "removeCookieWarnings": true,
        "expandIframes": true,
        "clickElementsCssSelector": "[aria-expanded=\"false\"]",
        "htmlTransformer": "readableText",
        "readableTextCharThreshold": 100,
        "aggressivePrune": false,
        "debugMode": false,
        "debugLog": false,
        "saveHtml": false,
        "saveHtmlAsFile": false,
        "saveMarkdown": false,
        "saveFiles": false,
        "saveScreenshots": false,
        "maxResults": 9999999,
        "clientSideMinChangePercentage": 15,
        "renderingTypeDetectionPercentage": 10
    };
};



export const getDataFromApify = async (actorRunId: string) => {
    const { items } = await client.dataset(actorRunId).listItems();
    return items as unknown as ScrapingOutput[]
}


type ScrapingOutput = {
    url: string,
    text: string,
    metadata: {
        canonicalUrl: string,
        title: string,
        description: string,
        author: string,
        keywords: string[],
        languageCode: string,
        contentType: string,
        statusCode: number,
    }
}