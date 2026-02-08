RBAC 権限境界表（Executable Core）

以下の表は、
本システムにおけるロール別権限の
唯一の実行可能定義である。

本表に記載のない操作は、
すべて「拒否（Deny）」として扱う。
【実行境界宣言（RBAC）】

本ドキュメント内に記載される
「未定義」「要検討」「TBD」「Need Decision」
「Undefined」等の表現は、

すべて設計メモまたは検討履歴であり、
実行定義・アクセス制御・API 実装・
権限判定ロジックには一切影響を与えない。

RBAC の実行判定は、
明示的に「許可（Allow）」と定義された操作のみを対象とし、
それ以外のすべての操作は
暗黙的に「拒否（Deny）」として扱う。

本ドキュメント内の記述は、
本宣言をもって実行境界が確定したものとする。

事実の厳守: Architect.md に記述されている内容のみを抽出します。
推測の排除: 一般的な常識（例：「エージェントは物件を検索できるはず」）であっても、文書に明記がない限り「Allowed」には含めません。
未定義の明示: 文書間で整合性が取れていない、または記述が欠落している部分は「Undefined / Need Decision」として可視化します。
Permission Boundary Table (Draft)
Role	Responsibility	Allowed Actions	Forbidden Actions	Undefined / Need Decision
Admin	System Administrator(システム管理者)	・Full access to all resources・User management	(入力に明示的な禁止事項なし)	・監査ログの削除権限・システム設定(Config)の変更権限
Agent	Verified Real Estate Agent(認証済み不動産エージェント)	・Management of listings・Management of contracts・Management of transactions	(入力に明示的な禁止事項なし)	・User management (Adminのみか？)・Viewing of offers (Ownerのみか？)・自身のプロフィール更新
Owner	Property Owner(物件所有者)	・Management of owned properties・Viewing of offers	(入力に明示的な禁止事項なし)	・オファーへの応答（承諾/拒否）・Listings/Contractsの参照権限・自身のプロフィール更新
Customer	End User (Default)(エンドユーザー)	・Read-only access to public listings・Write access to own profile	(入力に明示的な禁止事項なし)	・オファーの作成 (Create Offer)・エージェントへの問い合わせ
Pending_Agent	Unverified Staff(未検証スタッフ)	・Access specific onboarding endpoints (Document Upload, Status Check)・Read their own user profile	・Business-critical write operations (Listings, Contracts)	・Read-only access to public listings (Customer権限を継承するか？)・Write access to own profile (Customerは可だが、こちらはReadのみ明記)
補足：入力文書に基づく判断根拠
Pending_Agent の制約:

Architect.md にて "MUST NOT access business-critical write operations" と明記されているため、これを Forbidden に設定しました。
"Restricted access limited to onboarding" (オンボーディングに限定された制限付きアクセス) と記述がある一方で、デフォルトロールである Customer が持つ "Read-only access to public listings" を継承するかどうかが明記されていないため、Undefined としました。

Customer の権限:
"Existing users ... default to the Customer role" とあるため、このロールの権限がベースラインとなりますが、他ロール（特に Pending_Agent）がこれを継承するかどうかは Architect.md に明記されていません。
オファー機能の未定義:

Owner に "Viewing of offers" が許可されていますが、誰が "Make Offer" (オファー作成) を行うのか記述がありません（通常は Customer ですが、推測禁止ルールにより Undefined としています）。

本権限境界表において「Undefined / Need Decision」と
明示された操作は、業務判断が確定するまで
いかなる実装・API・UI においても
Allowed として扱ってはならない。