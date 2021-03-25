
export default function * LFSR(length, seed, bitmask) {
  /** == Linear Feedback Shift Register ==
   *  Javascript implementation of a LFSR function using bitwise operators.
   *  Default mask uses optimal XOR taps for a 32-bit integer, which is the
   *  limit for bitwise operations in javascript.
   * 
   *  Default mask is 0x80000057, or 10000000000000000000000001010111 in 
   *  binary format. XOR taps: (x^32 + x^7 + x^5 + x^3 + x^2 + x^1 + 1)
   *  
   * @param  {Number} [length]  : Length of number in bytes.
   * @param  {Number} [seed]    : The starting seed for the shift register.
   * @param  {Number} [bitmask] : Mask to use for mapping XOR taps.
   * @return {Array}            : Returns character string.
   **/

  const len    = length || 32,
        buffer = new ArrayBuffer(8),
        bits   = new Uint32Array(buffer, 0, 1),
        mask   = new Uint32Array(buffer, 4, 1),
        bytes  = new Array(len);

  let i = 0; mask[0] = bitmask; bits[0] = seed || mask;
  
  while (true) {
    bytes[i] = bytes[i] <<1 | 
    (bits[0] = bits[0] >>1 ^(bits[0] &1 && mask[0])) &1;
    i++;
    if (i >= len) { yield bytes.slice(0); bytes.length = i = 0; }
  }
}
