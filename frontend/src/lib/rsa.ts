import { JSEncrypt } from 'jsencrypt'

/**
 * 使用公钥加密字符串。
 *
 * @param publicKey - 公钥
 * @param raw - 原始字符串
 * @returns - 加密后的字符串
 */
function encrypt(publicKey: string, raw: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(raw) as string
}

/**
 * 使用私钥解密字符串。
 *
 * @param privateKey - 私钥
 * @param encrypted - 加密后的字符串
 * @returns - 解密后的字符串
 */
function decrypt(privateKey: string, encrypted: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPrivateKey(privateKey)
  return encrypt.decrypt(encrypted) as string
}

export { encrypt, decrypt }
