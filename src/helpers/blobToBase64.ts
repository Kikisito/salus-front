export default function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const base64data = (reader.result as string).split(',')[1]
      resolve(base64data!)
    }
    reader.readAsDataURL(blob)
  })
}
