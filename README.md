## Field Seating 球場坐座-座位視野共享平台 API

[![Test](https://github.com/field-seating/field-seating-api/actions/workflows/test.yml/badge.svg)](https://github.com/field-seating/field-seating-api/actions/workflows/test.yml)

透過群眾上傳，提升看球體驗！看棒球？先來球場坐座，再到球場坐坐！  
<<<<<<< HEAD
立即前往使用 --> <a href="https://www.fieldseating.com/">球場坐座</a>

<a href="https://api.fieldseating.com/health">API</a>
| <a href="https://doc.clickup.com/25699357/d/h/rg90x-480/80850ee4a15b39b">API 文件</a>

- Environment: Node.js v16.13.1
- Database: MySQL 8.0.27 / Redis

=======
立即前往使用 --> <a href="https://www.fieldseating.com/">球場坐座</a>

<a href="https://api.fieldseating.com/health">API</a>
| <a href="https://doc.clickup.com/25699357/d/h/rg90x-480/80850ee4a15b39b">API 文件</a>

- Environment: Node.js v16
- Database: MySQL v8 / Redis

> > > > > > > 54abe04bd6fa171484b5feb180b032dbd161b13d

## 安裝

1. 開啟終端機(Terminal)cd 到存放專案本機位置並執行:

```
git clone https://github.com/field-seating/field-seating-api.git
```

# <<<<<<< HEAD

> > > > > > > 54abe04bd6fa171484b5feb180b032dbd161b13d 2. 初始

```
cd field-seating-api //切至專案資料夾
npm install  //安裝套件
<<<<<<< HEAD
npm install nodemon   // 另行安裝nodemon
```

```
將資料夾內'.env.example'檔案名稱改為'.env'
```

3. env 相關

- DATABASE_URL: 請自行建立 MySQL 資料庫
- JWT_SECRET: 請自行設定 JasonWebToken
- REDIS_URL: 請自行設定 redis 連線網址
- DO_ACCESS_KEY&DO_SECRET: 本產品存放空間使用<a href="https://www.digitalocean.com/">digitalOcean</a>
- # SENDGRID_API_KEY: 本產品驗證信寄發服務使用<a href="https://sendgrid.com/">sendgrid</a>

```

```

將資料夾內'.env.example'檔案名稱改為'.env'

```

3. env 相關

- DATABASE_URL: 請自行建立 MySQL 資料庫
- JWT_SECRET: 請自行設定 JasonWebToken
- REDIS_URL: 請自行設定 redis 連線網址
- DO_ACCESS_KEY&DO_SECRET: 本產品存放空間使用<a href="https://www.digitalocean.com/">digitalOcean</a>
- SENDGRID_API_KEY: 本產品驗證信寄發服務使用<a href="https://sendgrid.com/">sendgrid</a>
>>>>>>> 54abe04bd6fa171484b5feb180b032dbd161b13d

4. 資料庫建置

```

<<<<<<< HEAD
npm run db:deploy // 載入模組  
npm run db:seed // 載入種子資料（樂天桃園棒球場）
node data/20220915_create_xinZhuang_field_data.js // 載入新莊球場資料

```
=======
npm run db:deploy // 載入模組
npm run db:seed // 載入種子資料（樂天桃園棒球場）
node data/20220915_create_xinZhuang_field_data.js // 載入新莊球場資料
```

> > > > > > > 54abe04bd6fa171484b5feb180b032dbd161b13d 5. 開啟程式

```
npm run dev
```

<<<<<<< HEAD
當終端機(terminal)出現以下文字，代表伺服器已啟動

```
{"level":"info","message":"App listening on port 3000","appEnv":"development"}
```

若要暫停使用

```
ctrl + c
```

## 測試

1. 測試範圍：針對商業邏輯主要存在的 service 層及相關工具
2. 執行測試：

=======

當終端機(terminal)出現以下文字，代表伺服器已啟動

```
{"level":"info","message":"App listening on port 3000","appEnv":"development"}
```

## 測試

1. 測試範圍：針對商業邏輯主要存在的 service 層及相關工具
2. 執行測試：

> > > > > > > 54abe04bd6fa171484b5feb180b032dbd161b13d

```
請先安裝docker

npm run container:test  // 測試
npm run container:test:watch  // 測試並持續監聽
```

<<<<<<< HEAD

## 版本更新

## 使用工具

# 請參閱 package.json

## 使用工具

請參閱 package.json

> > > > > > > 54abe04bd6fa171484b5feb180b032dbd161b13d
