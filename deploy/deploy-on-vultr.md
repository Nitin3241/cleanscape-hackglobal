# Deploy Earthy on Vultr

Puts the Earthy server (`server/`) live on a Vultr Cloud Compute machine with Docker. About 15 minutes.
Adapted from the [HackGlobal starter kit](https://github.com/shubhamupadhyay-pixel/hackglobal-starter) deploy guide.

## 1. Get an inference key

Vultr Console > **Serverless Inference** > create a subscription. Copy the **API key** and one **model name** from the model list.

## 2. Create a server

Vultr Console > **Deploy** > **Cloud Compute (Shared CPU)** > image **Ubuntu** (latest LTS) > smallest plan with 1 GB RAM > **Deploy Now**.
When it shows **Running**, note the **IP address** and **password** on the Overview page.

## 3. Connect

Easiest: on the server's Overview page click **View Console** (top right) and log in as `root` with the password.
Or from a terminal: `ssh root@YOUR_SERVER_IP`.

## 4. Install and run

```bash
curl -fsSL https://get.docker.com | sh
apt-get install -y git
git clone https://github.com/Nitin3241/cleanscape-hackglobal.git
cd cleanscape-hackglobal/server
cp .env.example .env
nano .env        # paste the API key and model name, then Ctrl+O, Enter, Ctrl+X
docker build -t earthy .
docker run -d --name earthy --restart unless-stopped --env-file .env -p 80:8000 earthy
ufw allow 80/tcp || true
```

## 5. Check

- `http://YOUR_SERVER_IP` shows the Ask Earthy page. This is the live demo URL.
- `http://YOUR_SERVER_IP/health` shows `"key_set": true`.

## 6. Point the app at it

In `app/`, copy `.env.example` to `.env` and set:

```
EXPO_PUBLIC_EARTHY_API_URL=http://YOUR_SERVER_IP
```

Restart `npx expo start`. Typing a question to Earthy now gets a live answer.

## Updating

```bash
cd ~/cleanscape-hackglobal && git pull && cd server
docker rm -f earthy && docker build -t earthy .
docker run -d --name earthy --restart unless-stopped --env-file .env -p 80:8000 earthy
```

## The browser version of the app

The server also serves the app itself, built for the browser, under `/app`. The built files are in the repo
(`server/static/app`), so the server needs nothing extra. To rebuild them after changing the app:

```bash
deploy/build-browser-app.sh      # then commit server/static/app and update the server as above
```

A phone browser only allows the microphone and camera on an https address. This gives the server one, with a
certificate, without touching the app's own http address (`a.b.c.d` becomes `a-b-c-d.sslip.io`):

```bash
ufw allow 443
mkdir -p /root/caddy
printf '{\n  auto_https disable_redirects\n  http_port 8088\n}\nYOUR-SERVER-IP-WITH-DASHES.sslip.io {\n  reverse_proxy localhost:80\n}\n' > /root/caddy/Caddyfile
docker run -d --name caddy --restart unless-stopped --network host \
  -v /root/caddy/Caddyfile:/etc/caddy/Caddyfile -v caddy_data:/data caddy:2
```

## Not working?

| Problem | Try |
| --- | --- |
| Page doesn't load | `docker ps`, then `docker logs earthy` |
| "LLM_API_KEY is not set" | Fix `server/.env`, rerun the docker commands |
| Answers fail with 502 | Model name in `.env` doesn't match the Vultr model list |
