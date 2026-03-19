# SSL Certificates Directory

This directory contains Cloudflare Origin Certificate files.

## Files Required:
- `origin.pem` - Origin Certificate from Cloudflare
- `origin-key.pem` - Private Key from Cloudflare

## How to get these files:
1. Go to Cloudflare Dashboard → SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Choose RSA (2048) and 15 years validity
4. Save Origin Certificate as `origin.pem`
5. Save Private Key as `origin-key.pem`

⚠️ IMPORTANT: Never commit private keys to git!
