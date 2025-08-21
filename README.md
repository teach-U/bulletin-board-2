# 📋 掲示板アプリ 仕様書

## 技術スタック

* **フロントエンド / バックエンド**: Next.js (App Router)
* **データベース**: SQLite
* **ORM**: Prisma
* **UI**: Tailwind CSS + shadcn/ui
* **認証**: 独自実装（ユーザー名+パスワード / Cookie セッション）
* **セッション有効期限**: 7日間

---

## 認証仕様

* サインアップ

  * `username` は一意
  * パスワードは bcrypt でハッシュ化して保存
* ログイン

  * 成功したら `sessions` テーブルにセッションを作成
  * Cookie に HttpOnly の `session_id` を保存
  * 有効期限は 7日間
* ログアウト

  * `sessions` テーブルから削除し、Cookie も無効化
* ページ遷移ごとに SSR で `getUserFromCookie` を呼び出して認証確認

---

## 機能一覧

* **認証**

  * サインアップ / ログイン / ログアウト
  * プロフィール閲覧 / 編集（ユーザー名、パスワード変更）
* **掲示板**

  * スレッド作成 / 閲覧 / 編集 / 削除
  * コメント作成 / 編集 / 削除
  * コメント返信機能（ツリー構造）
  * スレッド / コメント検索

---

## ページ仕様

### トップ（スレッド一覧 `/threads`）

* スレッド一覧（タイトル / 投稿者 / 投稿日）
* 検索フォーム
* （ログイン時）新規スレッド作成ボタン

### ログイン `/login`

* フォーム（ユーザー名 / パスワード）
* ログイン済みなら `/threads` にリダイレクト

### サインアップ `/signup`

* フォーム（ユーザー名 / パスワード）
* 登録後、自動でログイン状態にする

### プロフィール `/profile`

* ユーザー名 / 登録日
* プロフィール編集ページへのリンク
* ログアウトボタン

### プロフィール編集 `/profile/edit`

* ユーザー名変更
* パスワード変更（新しいパスワード入力 & 確認）

### スレッド詳細 `/threads/[id]`

* スレッドタイトル / 本文 / 投稿者 / 投稿日
* コメント一覧（返信はツリー表示）
* （ログイン中）コメント投稿フォーム
* （投稿者本人のみ）編集・削除ボタン

### スレッド作成 `/threads/new`

* タイトル・本文フォーム
* 作成ボタン

### 検索結果 `/search?q=xxx`

* スレッドとコメントを分けて表示
* コメント結果はスレッド詳細へのリンク付き

---

## データベース設計（Prisma schema）

```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  threads   Thread[]
  comments  Comment[]
  sessions  Session[]
}

model Session {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Thread {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  comments  Comment[]
}

model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  threadId  Int
  thread    Thread    @relation(fields: [threadId], references: [id])
  parentId  Int?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

## SSRデータフロー

* 各ページで `getUserFromCookie` を呼び出し、セッション確認
* SSRで取得するデータ:

  * `/threads` → スレッド一覧
  * `/profile` → ログインユーザー情報
  * `/threads/[id]` → スレッド情報 + コメント一覧
  * `/search` → 検索結果（スレッド / コメント）
* API Routes は更新系操作（ログイン、サインアップ、投稿、編集、削除）専用
