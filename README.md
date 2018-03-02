[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][coverage-image]][coverage-url]

# 🥐  Brotli decoder to [`fetch-h2`](https://www.npmjs.com/package/fetch-h2)

[![Greenkeeper badge](https://badges.greenkeeper.io/grantila/fetch-h2-br.svg)](https://greenkeeper.io/)

This package provides a content decoder for the Brotli (`br`) encoding using the [`iltorb`](https://www.npmjs.com/package/iltorb) package (which is a wrapper around the native `brotli` C library). By using this with [`fetch-h2`](https://www.npmjs.com/package/fetch-h2), requests will add `'br'` as accepted encoding to the server, and will decode it.

Use this on the default `fetch-h2` context by its `setup( )`, or for new contexts when creating them.

# Usage

## Import

The decoder is default-exported (with TS/ES6 modules), but can also be imported using `require`, although as a property `brDecode`.

```ts
import brDecode from 'fetch-h2-br'
// or, if using require:
const { brDecode } = require( 'fetch-h2-br' );
```

`brDecode` is a function without arguments which returns a decoder.

## `fetch-h2` contexts

Decoders can be provided to `fetch-h2` per-context. Since `fetch-h2` always has a default-context, decoders can be applied by running `setup( )`. For new contexts, it can be provided to the `context( )` function.

### Default context

```ts
import { setup, fetch } from 'fetch-h2'
import brDecode from 'fetch-h2-br'

// Setup only once to avoid undefined behavior
setup( { decoders: [ brDecode( ) ] } );

// Now, all subsequent fetch-calls will support the 'br' encoding:
const response = await fetch( 'https://host/file' );
```

### Custom context

Create a new context where `'br'` should be supported:

```ts
import { context } from 'fetch-h2'
import brDecode from 'fetch-h2-br'

// Setup only once to avoid undefined behavior
const { fetch } = context( { decoders: [ brDecode( ) ] } );

// Now, all subsequent fetch-calls with this particular fetch will support the 'br' encoding:
const response = await fetch( 'https://host/file' );

// Yet another context
const { fetch: fetchOther } = context( );
// fetchOther will *not* support 'br'
```

[npm-image]: https://img.shields.io/npm/v/fetch-h2-br.svg
[npm-url]: https://npmjs.org/package/fetch-h2-br
[travis-image]: https://img.shields.io/travis/grantila/fetch-h2-br.svg
[travis-url]: https://travis-ci.org/grantila/fetch-h2-br
[coverage-image]: https://coveralls.io/repos/github/grantila/fetch-h2-br/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/fetch-h2-br?branch=master
