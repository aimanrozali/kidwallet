export function decodeCard(bytesString: string): string {

  function stringToBytes(bytesString: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < bytesString.length; i += 2) {
      bytes.push(parseInt(bytesString.substr(i, 2), 16));
    }
    return bytes;
  }

  function bytesToHex(bytes: number[]): string {
    return bytes.map(byte => byte.toString(16).padStart(2, '0')).reverse().join('');
  }

  function bytesToDecimal(bytes: number[]): number {
    let result = 0;
    for (let i = 0; i < bytes.length; i++) {
      result += bytes[i] * Math.pow(256, i);
    }
    return result;
  }

  const bytes = stringToBytes(bytesString);

  const hexString = bytesToHex(bytes);

  const decimalValue = bytesToDecimal(bytes);

  const decimalValueString = decimalValue.toString().padStart(10, '0');

  return decimalValueString;
}