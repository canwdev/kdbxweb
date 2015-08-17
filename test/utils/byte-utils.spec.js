'use strict';

var expect = require('expect.js'),
    ByteUtils = require('../../lib/utils/byte-utils');

describe('ByteUtils', function() {
    describe('arrayBufferEquals', function() {
        it('should return true for equal ArrayBuffers', function () {
            var ab1 = new Int8Array([1,2,3]).buffer;
            var ab2 = new Int8Array([1,2,3]).buffer;
            expect(ByteUtils.arrayBufferEquals(ab1, ab2)).to.be(true);
        });

        it('should return false for ArrayBuffers of different length', function () {
            var ab1 = new Int8Array([1,2,3]).buffer;
            var ab2 = new Int8Array([1,2,3,4]).buffer;
            expect(ByteUtils.arrayBufferEquals(ab1, ab2)).to.be(false);
        });

        it('should return false for different ArrayBuffers', function () {
            var ab1 = new Int8Array([1,2,3]).buffer;
            var ab2 = new Int8Array([3,2,1]).buffer;
            expect(ByteUtils.arrayBufferEquals(ab1, ab2)).to.be(false);
        });
    });

    var str = 'utf8стрƒΩ≈ç√∫˜µ≤æ∆©ƒ∂ß';
    var strBytes = new Uint8Array([117,116,102,56,209,129,209,130,209,128,198,146,206,169,226,
        137,136,195,167,226,136,154,226,136,171,203,156,194,181,226,137,164,195,166,226,
        136,134,194,169,198,146,226,136,130,195,159]);

    describe('bytesToString', function() {
        it('should convert Array to string', function() {
            expect(ByteUtils.bytesToString(strBytes)).to.be(str);
        });

        it('should convert ArrayBuffer to string', function() {
            expect(ByteUtils.bytesToString(strBytes.buffer)).to.be(str);
        });
    });

    describe('stringToBytes', function() {
        it('should convert string to Array', function() {
            expect(ByteUtils.stringToBytes(str)).to.be.eql(strBytes);
        });
    });

    var base64 = 'c3Ry0L/RgNC40LLQtdGC';
    var bytes = new Uint8Array([115,116,114,208,191,209,128,208,184,208,178,208,181,209,130]);

    describe('base64ToBytes', function() {
        it('converts base64-string to byte array', function() {
            expect(ByteUtils.base64ToBytes(base64)).to.be.eql(bytes);
        });

        it('makes use of atob when available', function() {
            global.atob = function() { return 'a'; };
            expect(ByteUtils.base64ToBytes(base64)).to.be.eql({ 0: 'a'.charCodeAt(0) });
            delete global.atob;
        });
    });

    describe('bytesToBase64', function() {
        it('converts base64-string to byte array', function() {
            expect(ByteUtils.bytesToBase64(bytes)).to.be.eql(base64);
        });

        it('makes use of btoa when available', function() {
            global.btoa = function() { return 'a'; };
            expect(ByteUtils.bytesToBase64(base64)).to.be('a');
            delete global.btoa;
        });
    });

    describe('zeroBuffer', function() {
        it('fills array with zeroes', function() {
            var arr = new Uint8Array([1,2,3]);
            ByteUtils.zeroBuffer(arr);
            expect(arr).to.be.eql([0,0,0]);
        });

        it('fills array buffer with zeroes', function() {
            var arr = new Uint8Array([1,2,3]);
            ByteUtils.zeroBuffer(arr.buffer);
            expect(arr).to.be.eql([0,0,0]);
        });
    });

    describe('arrayToBuffer', function() {
        it('converts array to buffer', function() {
            var ab = ByteUtils.arrayToBuffer(new Uint8Array(4));
            expect(ab).to.be.an(ArrayBuffer);
            expect(ab.byteLength).to.be(4);
        });

        it('converts buffer to buffer', function() {
            var ab = ByteUtils.arrayToBuffer(new Uint8Array(4).buffer);
            expect(ab).to.be.an(ArrayBuffer);
            expect(ab.byteLength).to.be(4);
        });

        it('makes sliced buffer from sliced array', function() {
            var srcAb = new ArrayBuffer(10);
            var arr = new Uint8Array(srcAb, 1, 4);
            arr[0] = 1;
            expect(arr.buffer.byteLength).to.be(10);
            var ab = ByteUtils.arrayToBuffer(arr);
            expect(ab).to.be.an(ArrayBuffer);
            expect(ab.byteLength).to.be(4);
            expect(new Uint8Array(ab)[0]).to.be(1);
        });
    });
});
