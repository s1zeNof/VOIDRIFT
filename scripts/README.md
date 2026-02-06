# VOIDRIFT NFT Metadata Scripts

## Як налаштувати NFT metadata для OpenSea та гаманців

### Крок 1: Зареєструйся на Pinata (безкоштовно)

1. Перейди на https://app.pinata.cloud/
2. Створи акаунт
3. Перейди в API Keys → New Key
4. Створи ключ з правами "pinFileToIPFS" та "pinJSONToIPFS"
5. Збережи API Key та Secret Key

### Крок 2: Встанови залежності

```bash
cd scripts
npm init -y
npm install pinata-web3 dotenv
```

### Крок 3: Створи .env файл

```bash
# scripts/.env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
```

### Крок 4: Завантаж зображення на IPFS

```bash
node upload-images.js
```

Це завантажить всі зображення з `frontend/public/birds/` на IPFS і збереже CID в `image-cids.json`

### Крок 5: Згенеруй metadata

```bash
node generate-metadata.js
```

Це створить JSON файли для кожного NFT в папці `metadata/`

### Крок 6: Завантаж metadata на IPFS

```bash
node upload-metadata.js
```

Це завантажить папку metadata на IPFS і виведе baseURI для контракту

### Крок 7: Оновити контракт

Виклич функцію `setBaseURI(baseURI)` на контракті з отриманим IPFS URI

---

## Структура metadata (ERC-721 стандарт)

```json
{
  "name": "Riftwalker #1",
  "description": "A mysterious void bird from the VOIDRIFT dimension.",
  "image": "ipfs://QmXxx.../1.png",
  "attributes": [
    { "trait_type": "Species", "value": "Raven" },
    { "trait_type": "Rarity", "value": "Common" },
    { "trait_type": "Background", "value": "Void" }
  ]
}
```
