'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const get_stream_1 = require("get-stream");
const iltorb_1 = require("iltorb");
const server_1 = require("fetch-h2/dist/test/lib/server");
const fetch_h2_1 = require("fetch-h2");
const __1 = require("../../");
afterEach(fetch_h2_1.disconnectAll);
function ensureStatusSuccess(response) {
    if (response.status < 200 || response.status >= 300)
        throw new Error("Status not 2xx");
    return response;
}
describe('basic', () => {
    it('should accept brotli but decode gzip', async () => {
        const { server, port } = await server_1.makeServer();
        const host = 'localhost';
        const testData = { foo: "bar" };
        const { fetch, disconnectAll } = fetch_h2_1.context({ decoders: [__1.default()] });
        const response = ensureStatusSuccess(await fetch(`http://localhost:${port}/compressed/gzip`, {
            method: 'POST',
            json: testData,
        }));
        const stream = await response.readable();
        const data = await get_stream_1.buffer(stream);
        chai_1.expect(JSON.parse(data.toString())).to.deep.equal(testData);
        chai_1.expect(response.headers.get('content-encoding'))
            .to.equal('gzip');
        await disconnectAll();
        await server.shutdown();
    });
    it('should accept and decode brotli', async () => {
        const matchers = [
            ({ path, stream, headers }) => {
                if (path !== '/compressed-br')
                    return false;
                const responseHeaders = {
                    ':status': 200,
                    'content-encoding': 'br',
                };
                stream.respond(responseHeaders);
                stream.pipe(iltorb_1.compressStream()).pipe(stream);
                return true;
            }
        ];
        const { server, port } = await server_1.makeServer({ matchers });
        const host = 'localhost';
        const testData = { foo: "bar" };
        const { fetch, disconnectAll } = fetch_h2_1.context({ decoders: [__1.default()] });
        const response = ensureStatusSuccess(await fetch(`http://localhost:${port}/compressed-br`, {
            method: 'POST',
            json: testData,
        }));
        const stream = await response.readable();
        const data = await get_stream_1.buffer(stream);
        chai_1.expect(JSON.parse(data.toString())).to.deep.equal(testData);
        chai_1.expect(response.headers.get('content-encoding'))
            .to.equal('br');
        await disconnectAll();
        await server.shutdown();
    });
});
//# sourceMappingURL=index.js.map