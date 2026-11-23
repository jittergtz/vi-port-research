This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare Workers

This project uses the [OpenNext adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) to run Next.js, including `/api/status`, on a Cloudflare Worker named `vi-port-research`.

Use Node.js 22.12 or later and run the following from the project root.

```bash
npm ci
npm run preview
```

The preview runs in the Cloudflare Workers runtime. To deploy to your Cloudflare account, run `npx wrangler login` and then `npm run deploy`. For a Git-connected Workers build, use `npm run deploy` as the deploy command. It builds the app before uploading the Worker.

The status feed can use an optional `GITHUB_TOKEN`. Put it in `.dev.vars` for the Workers preview or set it for the deployed Worker with `npx wrangler secret put GITHUB_TOKEN`.

## Live repository status

Open `/status` to see Leonida’s reported playability, releases, recent commits,
and open issues and pull requests. The page checks the local API once per minute
when visible. Each running server reuses its last successful GitHub response
for five minutes and keeps displaying that snapshot if a refresh fails.

The public GitHub API works without credentials. If your server shares an IP
address or regularly hits GitHub rate limits, set an optional `GITHUB_TOKEN` in
`.env.local` for development or in your deployment's server environment. The
token stays on the server.
