# EmailJS setup – contact form emails to info.fitnfeat@gmail.com

The contact form needs **3 values** in your `.env` file. Get them from EmailJS (free).

---

## Step 1: Sign up

1. Go to **https://dashboard.emailjs.com**
2. Sign up (free account).

---

## Step 2: Add an Email Service (sends the email)

1. In the dashboard go to **Email Services** → **Add New Service**.
2. Choose **Gmail** (or another provider).
3. Connect your Gmail (e.g. info.fitnfeat@gmail.com) so EmailJS can send from it.
4. After saving, copy the **Service ID** (e.g. `service_abc123`).
5. Put it in `.env` as:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxx
   ```
   (replace `service_xxxxx` with your actual Service ID)

---

## Step 3: Create an Email Template (what the email looks like)

1. Go to **Email Templates** → **Create New Template**.
2. **To email:** set to `{{to_email}}` (so emails go to info.fitnfeat@gmail.com).
3. **Subject:** e.g. `FIT N FEAT – New message from {{from_name}}`
4. **Content (body)** – use these variables:
   - `{{from_name}}` – sender name  
   - `{{from_email}}` – sender email  
   - `{{from_phone}}` – sender phone  
   - `{{message}}` – message text  

   Example body:
   ```
   New contact form message

   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{from_phone}}

   Message:
   {{message}}
   ```
5. Save the template and copy the **Template ID** (e.g. `template_xyz789`).
6. Put it in `.env` as:
   ```env
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
   ```

---

## Step 4: Get your Public Key

1. In the dashboard go to **Account** → **API Keys** (or **General**).
2. Copy your **Public Key** (long string).
3. Put it in `.env` as:
   ```env
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

---

## Step 5: Update `.env` and restart

Your `.env` should have these three lines filled in (no quotes, no spaces around `=`):

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Then **restart the dev server** (`npm run dev`) so Vite picks up the new env values.

---

## Summary – the 3 things required

| Variable | Where to get it |
|----------|------------------|
| **VITE_EMAILJS_SERVICE_ID** | Email Services → your service → Service ID |
| **VITE_EMAILJS_TEMPLATE_ID** | Email Templates → your template → Template ID |
| **VITE_EMAILJS_PUBLIC_KEY** | Account → API Keys → Public Key |

After these are set and the app is restarted, the contact form will send emails to **info.fitnfeat@gmail.com**.
