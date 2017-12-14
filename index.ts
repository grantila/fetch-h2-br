'use strict'

import { DecodeFunction, Decoder } from 'fetch-h2'
import { decompressStream } from 'iltorb'


export default function brDecode( )
{
	return {
		name: 'br',
		decode( stream: NodeJS.ReadableStream ): NodeJS.ReadableStream
		{
			return stream.pipe( decompressStream( ) );
		}
	};
}

export { brDecode }
