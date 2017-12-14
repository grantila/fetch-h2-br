'use strict';

import 'mocha';
import { expect } from 'chai'
import { buffer as getStreamAsBuffer } from 'get-stream'
import { compressStream } from 'iltorb'

import { makeServer } from 'fetch-h2/dist/test/lib/server'

import { fetch, context, disconnectAll, Response } from 'fetch-h2'

import brDecode from '../../'

afterEach( disconnectAll );

function ensureStatusSuccess( response: Response ): Response
{
	if ( response.status < 200 || response.status >= 300 )
		throw new Error( "Status not 2xx" );
	return response;
}

describe( 'basic', ( ) =>
{
	it( 'should accept brotli but decode gzip', async ( ) =>
	{
		const { server, port } = await makeServer( );

		const host = 'localhost';
		const testData = { foo: "bar" };

		const { fetch, disconnectAll } =
			context( { decoders: [ brDecode( ) ] } );

		const response = ensureStatusSuccess(
			await fetch(
				`http://localhost:${port}/compressed/gzip`,
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
		const matchers = [
			( { path, stream, headers } ) =>
			{
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

		const host = 'localhost';
		const testData = { foo: "bar" };

		const { fetch, disconnectAll } =
			context( { decoders: [ brDecode( ) ] } );

		const response = ensureStatusSuccess(
			await fetch(
				`http://localhost:${port}/compressed-br`,
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
