![Polyestr TSX/Lit Transform Icon](https://cdn.rawgit.com/grasppe/polyestr-tsx-lit-transform/master/src/assets/logo.svg)

# Polyestr TSX/Lit Transform

A TypeScript TSX to tagged-template custom transform that builds into the
eco-system of Polyestr.

***FYI***: This is a very basic *concept proof* only not used or intended for
production or serious projects.

Please note that **TypeScript's compiler still does not offer native support for
configuring inline transformers in tsconfig.json.** This project includes a
simple example on how to pre-transform and compile using a makeshift compile.js
file which makes the transformations first passing all command-line
arguments to the resolved tsc module, doing it all in a single cammand.

## Getting started

1. In your project, install Google's Lit-HTML and this module.

    ```sh
    yarn add polyestr-tsx-lit-transform PolymerLabs/lit-html
    ```

    *Note:* If lit-html's dist folder is missing cd into it and run `yarn build`

2. You might need to tweak the global JSX namespace a little to make TypeScript
happy with our syntax. We tried this (but you obvious need something better):

    ```ts

    declare namespace JSX {
        type Element = any;

        interface IntrinsicElement extends Partial<HTMLElement> {
            [name: string]: any;
        }

        type IntrinsicElements = { [name: string]: IntrinsicElement; }
    }

    ```

    *Note:* If you are using another framework that requires specific JSX
    definitions you will need to find some compromise. The catch here is that
    we only need to define aspects for intrinsic elements so components should
    not really be affected (sadly, React is much harder to appease).

3. Import at lease `html` and `svg` from `lit-html` in your tsx file.

    If your type-checking options are more strict you may need to override
    the type definitions within your code like we did:

    ```ts
    // file: ./lit-html-adapter.ts

    import * as lit from 'lit-html-adapter';

    export type JSXFactory<T = lit.TemplateResult> = {
        (...elements): T;
        (strings: TemplateStringsArray, ...values: any[]): T;
    };

    export const html = lit.html as JSXFactory;
    export const svg = lit.svg as JSXFactory;

    export * from 'lit-html';

    ```

4. As you write your `TSX` you can opt into transforming specific JSX elements
by wrapping them inside a call to either `html` or `svg`:

    ```jsx
    // file: ./template.tsx

    import { html, svg } from "./lit-html-adapter";

    export const template =
        ({id = '<id>', text = '<text>'}) =>
            html(<p hidden id={id}><awesome-icon icon='awesome'/>{text}</p>);

    ```

5. At this time we only look for call expressions to `html` or `svg` that have
exactly one argument which is JSX element that must be well formed.

6. Nested elements are supported as long as they are direct descendants and are
not interrupted by a nested JSX expression. In the latter case, you simply need
to wrap any elements with a new call to the respective function:

    ```jsx

    // this will fail
    const bad = () => html(<p>{<span>…</span>}</p>)

    // this should work
    const good = () => html(<p>{html(<span>…</span>)}</p>)

    // this should also work
    const alsoGood = (tooGood = true) => html(
        <p>
            <span>…</span>
            { html(<span>…</span>) }
            {(tooGood) ? good() : ''}
        </p>
    );

    ```

7. This is highly experimental so we don't have any best practices, but you
should look into what Lit-HTML recommends and explore how you can leverage the
patterns they are recommending when composing your own templates.

8. Also consider checking out this repo and going through the `test` folder to
see what we've cooked (they are not really unit tests at this point, just some
static files, experiments, and debugging tools).

9. Please contribute and share your thoughts.

    Enjoy!

## Rationale

Tagged-templates and JSX can seem as two opposites at first, but for a lack of a
better word, they are orthogonal and not really opposites.

Using JSX (or TSX) with TypeScript allows for a superior development experience
that has been tried and tested and seems familiar to a lot of developers.

Replacing the nested factory calls with template expressions in the browser is
a much needed improvement on the statusquo.

This project tries to do just that with, and the release of Google's Lit-HTML
templating system and other similar projects (like the original hyperHTML) they
go a long way to make this possible.

If you feel that the two worlds don't belong together or want to know more, you
can take a look at [Why?](./WHY.md)
