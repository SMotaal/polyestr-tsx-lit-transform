![Polyestr TSX/Lit Transform Icon](https://cdn.rawgit.com/grasppe/polyestr-tsx-lit-transform/master/src/assets/logo.svg)

# Polyestr TSX/Lit Transform

## Why?

Below are some personal opinions on why you might want to leverage JSX and
template literals.

If you are just not a fan of adding a custom transformer, this is not for you,
instead we've been exploring ways to compile TSX normally then simply use a
custom createElement factory that plugins into Lit-HTML but that seems to be
a lot more fragile and heavy on the client side for production optimizations.

If you have other whys, the following might help.

### Why TSX/JSX?

First, it's about preference, but also about a robust development expereince.

Conventionally, JSX has been transformed into nested function calls to each
element's constructor, passing along it's properties as an object and it's
nested (and already constructed) children to each element until the top most
element is reached. This is mostly done in the browser, aside from a few
server-side-rendering frameworks.

The cost of constructing the DOM from nested function calls is high enough on
its own that parsing JSX in the browser was never really an option from a
performance standpoint and never gained traction in production.

Since JSX needed to be compiled during development, where performance is less
critical than production, the ability to add more value to the development
experience has led to an explosion in tooling making JSX a very real thing.

Although some libraries have taken on the initiative of pushing JSX into the
mainstream, JSX has been a thing and continues to be a thing of it's own.

If you use TypeScript, you must know that it has full support for it's own
flexible abstraction (TSX), which granted, was designed to meet the demands of
certain libraries, but has done so through care and reflection along the way.

So, if you compile with TSC, you can simply compile from TSX to anything you
want, including tagged-templates, leaving all the other baggage behind. You
don't need to compile into nested function calls, although you still could, and
you don't need to add new tools to do old tricks for a new syntax.

So is JSX (or TSX) really HTML? never, nothing is HTML except HTML itself,
JSX is JSX, it is HTML-like syntax that makes it possible to declare nested
structures that follow similar composition rules as the DOM. With the right
tools, JSX ties directly to variables and values in javascript code within the
scope where it resides during development and at runtime.

### Why Tagged-Template Expressions?

With introduction of tagged-templates a new wave of string-based component
libraries are gaining new momentum. The prior costs of interpolation, parsing
and caching are much lower than they used to be before tagged-templates.

Technically, tagged-template expressions differ from template-literals in the
fact that they are processed by a factory function which can synthesize the
static and dynamic parts of the template expression into anything from a string
to objects, and even full-blown DOM trees.

Although they still require delegating the construction of elements to some
factory, they differ from conventionally compiled JSX in many aspects.

You don't need a factory call for every single element in your tree, since
expressions can essentially result in well-formed HTML strings, all this
heavy-lifting can be delegated to the native DOMParser.

Tagged-templates have many uses beyond working the DOM, and tools have been
developed to provide excellent development experiences in various instances. On
top of that, support for tagged-templates in older production environemnts is
made possible by TypeScript and Babel, which might not be as superior as the
real thing, but makes tagged-templates a reliable mechanism that will only
continue to gain more traction.

So does this make it possible to cut-out abstractions like JSX and work directly
with javascript to produce efficient dynamic content in the browser with little
framework overhead. Well, if you have the tools, why not!

So are tagged-templates like HTML, no, still, they are not... etc. But they can
be much closer to it in a browser than anything we've seen so far. However, in
development, they are simply strings that look like HTML. Unless your tools can
make the connections, you will have to write HTML as strings and test in the
browser, at worse, but let's just assume that there will be a tool to use
tagged-templates in development for your favorite library soon.

### Why both?

With the two together, you can leverage everything JSX tooling has to offer for
developing robust, strong-typed template and still access the evolving powers of
tagged-templates at runtime without having to wait for tools to catch up.
