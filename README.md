# SETUP

1. Create the database "cms" in Cloudflare D1

2. Update wrangler.toml

```
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "DB"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "BUCKET"

[[d1_databases]]
binding = "CMS"
database_name = "cms"
database_id = "database_id"
```

3. Update app.d.ts with CMS

```js
declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				BUCKET: R2Bucket;
				CMS: D1Database;
			};
		}
	}
}

export {};
```
