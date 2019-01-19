'use strict';

import 'mocha';
import { expect } from 'chai'
import { buffer as getStreamAsBuffer } from 'get-stream'
import { compressStream } from 'iltorb'

import { Matcher } from 'fetch-h2-full/dist/test/lib/server-common'
import { makeMakeServer } from 'fetch-h2-full/dist/test/lib/server-helpers'

import { context, Response } from 'fetch-h2'

import brDecode from '../../'


function ensureStatusSuccess( response: Response ): Response
{
	/* istanbul ignore if */
	if ( response.status < 200 || response.status >= 300 )
		throw new Error( "Status not 2xx" );
	return response;
}

const prepare = async ( ) =>
	makeMakeServer( { proto: 'http:', version: 'http2' } );

describe( 'basic', async ( ) =>
{
	const host = 'localhost';

	it( 'should accept brotli but decode gzip', async ( ) =>
	{
		const { cycleOpts, makeServer } = await prepare( );
		const { server, port } = await makeServer( );

		const testData = { foo: "bar" };

		const { fetch, disconnectAll } =
			context( { ...cycleOpts, decoders: [ brDecode( ) ] } );

		const response = ensureStatusSuccess(
			await fetch(
				`http://${host}:${port}/compressed/gzip`,
				{
					method: 'POST',
					json: testData,
				}
			)
		);

		const stream = await response.readable( );

		const data = await getStreamAsBuffer( stream );

		expect( JSON.parse( data.toString( ) ) ).to.deep.equal( testData );
		expect( response.headers.get( 'content-encoding' ) )
			.to.equal( 'gzip' );

		await disconnectAll( );

		await server.shutdown( );
	} );

	it( 'should accept and decode brotli', async ( ) =>
	{
		const { cycleOpts, makeServer } = await prepare( );

		const matchers: Array< Matcher > = [
			( { path, stream } ) =>
			{
				/* istanbul ignore if */
				if ( path !== '/compressed-br' )
					return false;

				const responseHeaders = {
					':status': 200,
					'content-encoding': 'br',
				};

				stream.respond( responseHeaders );

				stream.pipe( compressStream( ) ).pipe( stream );

				return true;
			}
		];

		const { server, port } = await makeServer( { matchers } );

		const testData = { foo: "bar" };

		const { fetch, disconnectAll } =
			context( { ...cycleOpts, decoders: [ brDecode( ) ] } );

		const response = ensureStatusSuccess(
			await fetch(
				`http://${host}:${port}/compressed-br`,
				{
					method: 'POST',
					json: testData,
				}
			)
		);

		const stream = await response.readable( );

		const data = await getStreamAsBuffer( stream );

		expect( JSON.parse( data.toString( ) ) ).to.deep.equal( testData );
		expect( response.headers.get( 'content-encoding' ) )
			.to.equal( 'br' );

		await disconnectAll( );

		await server.shutdown( );
	} );
} );
