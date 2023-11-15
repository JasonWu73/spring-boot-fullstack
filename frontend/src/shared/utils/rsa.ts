import { JSEncrypt } from 'jsencrypt'

/**
 * 使用公钥加密字符串。
 */
function encrypt(publicKey: string, raw: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(raw) as string
}

/**
 * 使用私钥解密字符串。
 */
function decrypt(privateKey: string, encrypted: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPrivateKey(privateKey)
  return encrypt.decrypt(encrypted) as string
}

export { decrypt, encrypt }
