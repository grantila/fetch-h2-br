'use strict'

import { Decoder } from 'fetch-h2'
import { decompressStream } from 'iltorb'


export default function brDecode( ): Decoder
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
