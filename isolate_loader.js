/**
 * Automatically namespaces Sass files based on their file name
 */

const findName = /[\/\\]([^.\/\\]*).scss/;

module.exports = function(content) {
        this.cacheable();
        const className = findName.exec(this.resource)[1];
        return `.${className} {${content}}`;
};