import fs from 'fs';

const LF = 10;
const CR = 13;

/**
 * Combines two buffers
 *
 * @param {Object} [buffOne] First buffer object
 * @param {Object} [buffTwo] Second buffer object
 * @return {Object} Combined buffer object
 */
function _concat(buffOne?: Buffer, buffTwo?: Buffer): Buffer {
  if (!buffOne && !buffTwo) {
    throw new Error(
      'when concatenating two buffers, at least one buffer but exist',
    );
  }

  if (!buffOne) return buffTwo as Buffer;
  if (!buffTwo) return buffOne as Buffer;

  const newLength = buffOne.length + buffTwo.length;
  return Buffer.concat([buffOne, buffTwo], newLength);
}

/**
 * Generator based line reader
 *
 * @param {Number} [fd] The file descriptor
 * @param {Number} [filesize] The size of the file in bytes
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [position] The position where to start reading the file in bytes
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
export default function* readlines(
  fd: number,
  filesize: number,
  options:
    | {
        bufferSize?: number;
        position?: number;
        maxLineLength?: number;
      }
    | number = {},
  positionCompat?: number,
  maxLineLengthCompat?: number,
): Generator<Buffer> {
  let {
    bufferSize = 64 * 1024,
    position = 0,
    maxLineLength = Infinity,
  } = options
    ? typeof options === 'object'
      ? options
      : { bufferSize: options }
    : {};
  if (positionCompat !== undefined) {
    position = positionCompat;
  }
  if (maxLineLengthCompat !== undefined) {
    maxLineLength = maxLineLengthCompat;
  }
  if (maxLineLength <= 0) {
    throw new Error('maxLineLength must be a positive number');
  }

  const originalMaxLineLength = maxLineLength;
  let lineBuffer;
  let lastWasCR;

  while (position < filesize) {
    let remaining = filesize - position;
    if (remaining < bufferSize) bufferSize = remaining;

    let readChunk = Buffer.alloc(bufferSize);
    let bytesRead = fs.readSync(fd, readChunk, 0, bufferSize, position);

    let curpos = 0;
    let startpos = 0;
    let curbyte;
    while (curpos < bytesRead) {
      curbyte = readChunk[curpos++];
      // break after CR or LF, or after the maximum length, otherwise go on
      if (
        curbyte !== LF &&
        curbyte !== CR &&
        curpos - startpos <= maxLineLength
      ) {
        lastWasCR = false;
        continue;
      }

      // skip this LF if the last chunk ended with a CR
      if (curbyte === LF && lastWasCR) {
        startpos = curpos;
        lastWasCR = false;
        continue;
      }

      // create buffer from the last line break to the current position
      const buffer = _concat(lineBuffer, readChunk.slice(startpos, curpos - 1));
      // yield the buffer
      const wantedLength: any = yield buffer;
      // change the maximum length to the latest parameter of next()
      maxLineLength = wantedLength > 0 ? wantedLength : originalMaxLineLength;

      // skip one more character if a LF follows a CR, otherwise remember
      // that the CR was standing alone
      if (curbyte === CR) {
        if (readChunk[curpos] === LF) {
          ++curpos;
          lastWasCR = false;
        } else {
          lastWasCR = true;
        }
      } else {
        lastWasCR = false;
      }

      // invalidate the yielded buffer and move after the line break
      lineBuffer = undefined;
      startpos = curpos;
    }

    position += bytesRead;

    if (startpos < bytesRead) {
      lineBuffer = _concat(lineBuffer, readChunk.slice(startpos, bytesRead));
    }
  }
  // dump what ever is left in the buffer
  if (Buffer.isBuffer(lineBuffer)) {
    yield lineBuffer;
  }
}

/**
 * Generator based line reader with simplified API
 *
 * @param {string} [filename] Name of input file
 * @param {Number} [bufferSize] The size of the buffer in bytes
 * @param {Number} [maxLineLength] The length to stop reading at if no line break has been reached
 * @return {Object} The generator object
 */
export function* fromFile(
  filename: string,
  {
    bufferSize,
    maxLineLength,
  }: {
    bufferSize?: number;
    maxLineLength?: number;
  } = {},
) {
  const fd = fs.openSync(filename, 'r');
  const fileSize = fs.statSync(filename).size;

  yield* readlines(fd, fileSize, { bufferSize, maxLineLength });

  fs.closeSync(fd);
}
