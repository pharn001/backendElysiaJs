FROM node:20

## ຕິດຕັ້ງ openSSL
RUN apt-get update && apt-get install -y openssl

## ຕິດຕັ້ງ bun ແບບ gobal && upgrade ທູກເທື່ອທີ່ build
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun && \
    bun upgrade

WORKDIR /app

COPY . .
RUN bun install
RUN npx prisma generate
ENV port=3001

CMD ["bun", "run", "src/index.ts"]

