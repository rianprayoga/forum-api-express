# Setup Project

Create .env file
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/forum"
```

```shell

npm install 

npx prisma migrate dev

npx prisma generate

npm run build

npm run start

```