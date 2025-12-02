# Innr Landing Page

A modern, responsive landing page for Innr - defragmenting campus communication.

## Features

- 🎨 Beautiful 3D floating card animations
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and TypeScript
- 🎯 Tailwind CSS for styling
- 📧 Email waitlist signup (ready for Supabase integration)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main landing page component
└── components/              # Reusable components (ready for expansion)
```

## Brand Colors

- **Innr Red**: `#FF4136`
- **Black**: `#000000`
- **White**: `#FFFFFF`

## Next Steps

- [ ] Integrate Supabase for waitlist storage
- [ ] Add more interactive animations
- [ ] Implement analytics tracking
- [ ] Add mobile app download links when ready

## Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)