// see examples in https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/edit#

export type JsonMLObject = any[];
if (typeof window !== 'undefined') {
    /*
        jsonml-dom.js
        HTML to JsonML utility

        Created: 2007-02-15-2235
        Modified: 2012-11-03-2051

        Copyright (c)2006-2012 Stephen M. McKamey
        Distributed under The MIT License: http://jsonml.org/license
    */

    var JsonML = (JsonML || {}) as {
        addChildren(node: Element, filter: (node: Element) => boolean, jml: JsonMLObject): boolean;
        fromHTML(node: Element, filter: (node: Element) => boolean): JsonMLObject;
        fromHTMLText(html: string, filter: (node: Element) => boolean): JsonMLObject;
    };

    if (typeof module === 'object') {
        module.exports = JsonML;
    }

    (function(JsonML, document) {
        'use strict';


        var addChildren = function(/*DOM*/ elem, /*function*/ filter, /*JsonML*/ jml) {
            if (elem.hasChildNodes()) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var child = elem.childNodes[i];
                    child = fromHTML(child, filter);
                    if (child) {
                        jml.push(child);
                    }
                }
                return true;
            }
            return false;
        };

        /**
         * @param {Node} elem
         * @param {function} filter
         * @return {array} JsonML
         */
        var fromHTML = JsonML.fromHTML = function(elem, filter) {
            if (!elem || !elem.nodeType) {
                // free references
                return (elem = null);
            }

            var i, jml;
            switch (elem.nodeType) {
                case 1:  // element
                case 9:  // document
                case 11: // documentFragment
                    jml = [(elem.tagName || 'span').toLowerCase()];

                    var attr = elem.attributes,
                        props: any = {},
                        hasAttrib = false;

                    const computedStyle = window.getComputedStyle(elem);
                    const { color, backgroundColor = 'transparent', fontWeight, fontStyle, padding, display } = computedStyle;
                    Object.assign(elem.style, { color, backgroundColor, fontWeight, fontStyle, padding, display });

                    // elem.setAttribute('style', `color: ${computedStyle.color}; background-color: ${computedStyle.backgroundColor || 'transparent'}; font-weight: ${`);

                    for (i = 0; attr && i < attr.length; i++) {
                        if (attr[i].specified) {
                            if (attr[i].name === 'style') {
                                props.style = elem.style.cssText || attr[i].value;
                            } else if ('string' === typeof attr[i].value) {
                                props[attr[i].name] = attr[i].value;
                            }
                            hasAttrib = true;
                        }
                    }

                    if (hasAttrib) {
                        jml.push(props);
                    }

                    var child;
                    switch (jml[0].toLowerCase()) {
                        case 'frame':
                        case 'iframe':
                            try {
                                if ('undefined' !== typeof elem.contentDocument) {
                                    // W3C
                                    child = elem.contentDocument;
                                } else if ('undefined' !== typeof elem.contentWindow) {
                                    // Microsoft
                                    child = elem.contentWindow.document;
                                } else if ('undefined' !== typeof elem.document) {
                                    // deprecated
                                    child = elem.document;
                                }

                                child = fromHTML(child, filter);
                                if (child) {
                                    jml.push(child);
                                }
                            } catch (ex) { }
                            break;
                        case 'style':
                            child = elem.styleSheet && elem.styleSheet.cssText;
                            if (child && 'string' === typeof child) {
                                // unwrap comment blocks
                                child = child.replace('<!--', '').replace('-->', '');
                                jml.push(child);
                            } else if (elem.hasChildNodes()) {
                                for (i = 0; i < elem.childNodes.length; i++) {
                                    child = elem.childNodes[i];
                                    child = fromHTML(child, filter);
                                    if (child && 'string' === typeof child) {
                                        // unwrap comment blocks
                                        child = child.replace('<!--', '').replace('-->', '');
                                        jml.push(child);
                                    }
                                }
                            }
                            break;
                        case 'input':
                            addChildren(elem, filter, jml);
                            child = (elem.type !== 'password') && elem.value;
                            if (child) {
                                if (!hasAttrib) {
                                    // need to add an attribute object
                                    jml.shift();
                                    props = {};
                                    jml.unshift(props);
                                    jml.unshift(elem.tagName || '');
                                }
                                props.value = child;
                            }
                            break;
                        case 'textarea':
                            if (!addChildren(elem, filter, jml)) {
                                child = elem.value || elem.innerHTML;
                                if (child && 'string' === typeof child) {
                                    jml.push(child);
                                }
                            }
                            break;
                        default:
                            addChildren(elem, filter, jml);
                            break;
                    }

                    // filter result
                    if ('function' === typeof filter) {
                        jml = filter(jml, elem);
                    }

                    // free references
                    elem = null;
                    return jml;
                case 3: // text node
                case 4: // CDATA node
                    var str = String(elem.nodeValue);
                    // free references
                    elem = null;
                    return str;
                case 10: // doctype
                    jml = ['!'];

                    var type = ['DOCTYPE', (elem.name || 'html').toLowerCase()];

                    if (elem.publicId) {
                        type.push('PUBLIC', '"' + elem.publicId + '"');
                    }

                    if (elem.systemId) {
                        type.push('"' + elem.systemId + '"');
                    }

                    jml.push(type.join(' '));

                    // filter result
                    if ('function' === typeof filter) {
                        jml = filter(jml, elem);
                    }

                    // free references
                    elem = null;
                    return jml;
                case 8: // comment node
                    if ((elem.nodeValue || '').indexOf('DOCTYPE') !== 0) {
                        // free references
                        elem = null;
                        return null;
                    }

                    jml = ['!',
                        elem.nodeValue];

                    // filter result
                    if ('function' === typeof filter) {
                        jml = filter(jml, elem);
                    }

                    // free references
                    elem = null;
                    return jml;
                default: // etc.
                    // free references
                    return (elem = null);
            }
        };

        /**
         * @param {string} html HTML text
         * @param {function} filter
         * @return {array} JsonML
         */
        JsonML.fromHTMLText = function(html, filter) {
            var elem: any = document.createElement('div');
            elem.innerHTML = html;

            var jml = fromHTML(elem, filter);

            // free references
            elem = null;

            if (jml.length === 2) {
                return jml[1];
            }

            // make wrapper a document fragment
            jml[0] = '';
            return jml;
        };

    })(JsonML, document);
    const previousFormatter = window["devtoolsFormatters"];

    function Formatter() { // simpleFormatter?
        this._previousFormetter = previousFormatter;
        // this._simpleFormatter = simpleFormatter;
    }

    const styles = Object.assign(document.createElement('style'), {
        textContent: `
        .hljs {
            display: block;
            padding: 0.5em;
            background: white;
            color: black;
          }

          .hljs-comment,
          .hljs-template_comment,
          .hljs-javadoc {
            color: #800;
          }

          .hljs-keyword,
          .method,
          .hljs-list .hljs-title,
          .clojure .hljs-built_in,
          .nginx .hljs-title,
          .hljs-tag .hljs-title,
          .setting .hljs-value,
          .hljs-winutils,
          .tex .hljs-command,
          .http .hljs-title,
          .hljs-request,
          .hljs-status {
            color: #008;
          }

          .hljs-envvar,
          .tex .hljs-special {
            color: #660;
          }

          .hljs-string,
          .hljs-tag .hljs-value,
          .hljs-cdata,
          .hljs-filter .hljs-argument,
          .hljs-attr_selector,
          .apache .hljs-cbracket,
          .hljs-date,
          .hljs-regexp,
          .coffeescript .hljs-attribute {
            color: #080;
          }

          .hljs-sub .hljs-identifier,
          .hljs-pi,
          .hljs-tag,
          .hljs-tag .hljs-keyword,
          .hljs-decorator,
          .ini .hljs-title,
          .hljs-shebang,
          .hljs-prompt,
          .hljs-hexcolor,
          .hljs-rules .hljs-value,
          .hljs-literal,
          .hljs-symbol,
          .ruby .hljs-symbol .hljs-string,
          .hljs-number,
          .css .hljs-function,
          .clojure .hljs-attribute {
            color: #066;
          }

          .hljs-class .hljs-title,
          .haskell .hljs-type,
          .smalltalk .hljs-class,
          .hljs-javadoctag,
          .hljs-yardoctag,
          .hljs-phpdoc,
          .hljs-typename,
          .hljs-tag .hljs-attribute,
          .hljs-doctype,
          .hljs-class .hljs-id,
          .hljs-built_in,
          .setting,
          .hljs-params,
          .hljs-variable,
          .clojure .hljs-title {
            color: #606;
          }

          .css .hljs-tag,
          .hljs-rules .hljs-property,
          .hljs-pseudo,
          .hljs-subst {
            color: #000;
          }

          .css .hljs-class,
          .css .hljs-id {
            color: #9b703f;
          }

          .hljs-value .hljs-important {
            color: #ff7700;
            font-weight: bold;
          }

          .hljs-rules .hljs-keyword {
            color: #c5af75;
          }

          .hljs-annotation,
          .apache .hljs-sqbracket,
          .nginx .hljs-built_in {
            color: #9b859d;
          }

          .hljs-preprocessor,
          .hljs-preprocessor *,
          .hljs-pragma {
            color: #444;
          }

          .tex .hljs-formula {
            background-color: #eee;
            font-style: italic;
          }

          .diff .hljs-header,
          .hljs-chunk {
            color: #808080;
            font-weight: bold;
          }

          .diff .hljs-change {
            background-color: #bccff9;
          }

          .hljs-addition {
            background-color: #baeeba;
          }

          .hljs-deletion {
            background-color: #ffc8bd;
          }

          .hljs-comment .hljs-yardoctag {
            font-weight: bold;
          }
        `});

    const stage = document.createElement('div');
    stage.style.cssText = 'display: none;';
    document.body.appendChild(stage);

    const isSyntaxFragment = (object) => object instanceof DocumentFragment && object['type'] === 'highlighted-source-code';

    Formatter.prototype = {

        header: function(object) {
            if (isSyntaxFragment(object)) return ["div", {}, object.title || "Source Code"]; // JsonML.fromHTMLText(`<div style='font-weight: bold;'>${object.localName}</div>`)];
            // if ((object instanceof Node || object instanceof Array))
            //     return null;

            // var header = new JsonMLElement("span");
            // header.createTextChild(this._simpleFormatter.description(object));
            // return header.toJsonML();
        },

        hasBody: function(object) {
            // console.log(object);
            if (isSyntaxFragment(object)) return true;
            // if (object instanceof Array)
            //     return false;
            // return this._simpleFormatter.hasChildren(object);
        },

        body: function(object) {
            if (isSyntaxFragment(object)) {
                // return ["div", {}, JSON.stringify(JsonML.fromHTML(object))];
                const node = object.firstChild && object.firstChild.cloneNode(true);
                if (!node) return null;
                styles.remove();
                stage.innerHTML = '<div style="margin: 5px 2px; padding: 5px; border-left: 5px solid #BCF; line-height: 150%; white-space: pre"></div>';
                stage.appendChild(styles), (stage.firstChild as Element).appendChild(node);
                const { stringify } = JSON;
                const content = JsonML.fromHTML(stage.firstChild);
                return content; // ["div", {}, ...content];
            }
            // var body = new JsonMLElement("ol");
            // body.setStyle("list-style-type:none; padding-left: 0px; margin-top: 0px; margin-bottom: 0px; margin-left: 12px");
            // var children = this._simpleFormatter.children(object);
            // for (var i = 0; i < children.length; ++i) {
            //     var child = children[i];
            //     var li = body.createChild("li");
            //     var objectTag;
            //     if (typeof child.value === "object")
            //         objectTag = li.createObjectTag(child.value);
            //     else
            //         objectTag = li.createChild("span");

            //     var nameSpan = objectTag.createChild("span");
            //     nameSpan.createTextChild(child.key + ": ");
            //     nameSpan.setStyle("color: rgb(136, 19, 145);");
            //     if (child.value instanceof Node) {
            //         var node = child.value;
            //         objectTag.createTextChild(node.nodeName.toLowerCase());
            //         if (node.id)
            //             objectTag.createTextChild("#" + node.id)
            //         else
            //             objectTag.createTextChild("." + node.className)
            //     }
            //     if (typeof child.value !== "object")
            //         objectTag.createTextChild("" + child.value);

            // }
            // return body.toJsonML();
        },

        // _arrayFormatter: function(array) {
        //     var j = new JsonMLElement();
        //     j.createTextChild("[");
        //     for (var i = 0; i < array.length; ++i) {
        //         if (i != 0)
        //             j.createTextChild(", ")
        //         j.createObjectTag(array[i]);
        //     }
        //     j.createTextChild("]");
        //     return j;
        // }
    }

    window["devtoolsFormatters"] = [new Formatter()];

    // function JsonMLElement(tagName?) {
    //     this._attributes = {};
    //     this._jsonML = [tagName, this._attributes];
    // }


    // JsonMLElement.prototype = {

    //     createChild: function(tagName) {
    //         var c = new JsonMLElement(tagName);
    //         this._jsonML.push(c.toJsonML());
    //         return c;
    //     },

    //     createObjectTag: function(object) {
    //         var tag = this.createChild("object");
    //         tag.addAttribute("object", object);
    //         return tag;
    //     },

    //     setStyle: function(style) {
    //         this._attributes["style"] = style;
    //     },

    //     addAttribute: function(key, value) {
    //         this._attributes[key] = value;
    //     },

    //     createTextChild: function(text) {
    //         this._jsonML.push(text + "");
    //     },

    //     toJsonML: function() {
    //         return this._jsonML;
    //     }
    // }

    // function SimpleFormatter() { }

    // SimpleFormatter.prototype = {

    //     description: function(object) {
    //         if ((typeof object === "object") && object)
    //             return object.constructor.name;
    //         return object;
    //     },

    //     hasChildren: function(object) {
    //         return (typeof object === "object");
    //     },

    //     children: function(object) {
    //         var result: object[] = [];
    //         for (var key in object)
    //             result.push({ key: key, value: object[key] });
    //         return result;
    //     }
    // }

    // window["devtoolsFormatters"] = [new Formatter(new SimpleFormatter())];
}
