# Add QR Code for Canva

## Instructions for Adding the QR Code

To complete the QR code integration, please follow these steps:

### 1. Save the QR Code Image

- Extract the QR code from the provided image
- Save it as `qr-code-canva.png`
- Place it in the `public/` folder: `public/qr-code-canva.png`

### 2. Image Specifications

- **Filename**: `qr-code-canva.png`
- **Location**: `public/qr-code-canva.png`
- **Description**: QR code for accessing Canva portfolio
- **Size**: Should be square (recommended: 256x256 pixels or higher)

### 3. What's Already Done

✅ Updated CommerceContact component to display the QR code
✅ Added proper alt text and styling
✅ Added fallback placeholder in case image doesn't exist
✅ Updated description text to "Scan to access Canva portfolio"

### 4. How It Works

- The QR code will appear in the contact section of your website
- Users can scan it to access your Canva portfolio
- If the image file doesn't exist, a placeholder will show instead
- The QR code is styled with a white background and border for better visibility

### 5. QR Code Content

The QR code should link to:

- Your Canva profile/portfolio
- Or a specific Canva design
- Make sure the QR code contains the correct Canva URL

### 6. Location on Website

The QR code appears in:

- Contact section (`/contact`)
- CommerceContact component
- Right side of the contact details card
