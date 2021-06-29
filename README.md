# ChatApp

![ChatAPP](https://github.com/gold9450412/pratice/blob/master/README/ChatAPP.png)

因為要寫網路程式，練習寫一個基本的即時聊天app

## 功能:

註冊: 自動發信、比對帳號/信箱是否重複、信箱格式檢測、密碼比對

登入: 到後端比對帳號密碼

首頁: 好友列表、群組列表

使用者頁面: 查看及修改自己的詳情(簡介、性別、生日、手機...)、登出、刪除好友

搜尋: 到後端搜尋使用者並返回前端

聊天: 訊息、圖片、地圖位置、1對1聊天、群組聊天、訊息已讀/未讀更新

好友: 建立好友、發送好友邀請

群組: 建立群組

---

## 環境:

開發工具: uni-app、Hbuilder

前端: HTML、JavaScript、CSS

後端: NodeJS (Express框架)、MongoDB

Hbuilder為支援uni-app的IDE [https://www.dcloud.io/](https://www.dcloud.io/)

NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)

打包成APK [https://nativesupport.dcloud.net.cn/AppDocs/README](https://nativesupport.dcloud.net.cn/AppDocs/README)

## 為什麼使用uni-app?

一套語言即可跨多端 (Android、IOS、Web...)，使用前端三件套(HTML、JavaScript、CSS)，是成熟、易讀、簡單的前端語言，可以快速建立出前端，並且因為語言特性，容易理解並維護。

不一定要使用uni-app，語言邏輯都是一樣的，可以到AndroidStudio用Java或Kotlin重構。

---

## 重要的資料夾結構:

### 前端 chatapp:

chatapp/static 前端的圖片

chatapp/pages 前端各個頁面程式碼

&emsp;—buildgroup: 建立群組

&emsp;—chatroom: 聊天室 

&emsp;—friendrequest: 好友邀請

&emsp;—grouphome: 群組詳情 (未完成)

&emsp;—index: 首頁

&emsp;—search: 搜尋好友/群組

&emsp;—signin: 登入頁面

&emsp;—signup: 註冊頁面

&emsp;—test: 測試

&emsp;—userdetails: 使用者介紹

&emsp;—userhome: 使用者詳情

### 後端 NodeJS:

server/config/db.js 連接資料庫及配置

server/dao 主功能資料夾

&emsp;—bcrypt.js 加密，用來加密密碼，防止密碼外洩

&emsp;—dbserver.js 與前端交互的各種功能，全部主要功能都在這

&emsp;—emailserver.js 自動發信功能，裡面options內的html，可以用html打造自己的信要長怎樣

&emsp;—jwt.js 建立token，類似cookie，不必每次開啟都要登入

&emsp;—socket.js 主要用於聊天，接收使用者聊天訊息，以及相關處理

server/model 定義資料庫結構

server/router 放置API，前端與後端聯繫的接口

server/server 處理接口進來的資料，處理方法實作在server/dao/dbserver.js

---

## 編譯:

1.  chatapp/main.js，以下2項修改成自己的IP

![ChatApp%20126f2d94a00d45168a213d4ffe5a47f0/Untitled%201.png](https://github.com/gold9450412/pratice/blob/master/README/IP_config.png)

2. 如果需要註冊完的自動發信功能，需要到server/config/credential.js更改配置

帳號為自己的Gmail，配置密碼(pass) 取得教學:[https://oranwind.org/gmail-smtp/](https://oranwind.org/gmail-smtp/) 

![ChatApp%20126f2d94a00d45168a213d4ffe5a47f0/Untitled%202.png](https://github.com/gold9450412/pratice/blob/master/README/email_config.png)

3. Hbuilder導入chatapp資料夾後，可依照下圖，在Web端或手機端，邊寫前端邊及時調適。

![ChatApp%20126f2d94a00d45168a213d4ffe5a47f0/Untitled%203.png](https://github.com/gold9450412/pratice/blob/master/README/compiler1.png)

4.  用cmd到server底下，輸入node chatapp.js，開啟後端

![ChatApp%20126f2d94a00d45168a213d4ffe5a47f0/Untitled%204.png](https://github.com/gold9450412/pratice/blob/master/README/compiler2.png)
