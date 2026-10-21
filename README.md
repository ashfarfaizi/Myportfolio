# 🚀 Faizi Ashfar - Portfolio

A classy, 3D portfolio for a software engineer working across full-stack, cloud and AI/ML. Built with plain HTML, CSS and JavaScript plus Three.js for the interactive 3D hero.

## 🌟 Live Demo

**[View Live Portfolio](https://ashfarfaizi.github.io/Portfolio/)**

## ✨ Features

- **Interactive 3D hero** — an iridescent, noise-displaced sculpture with orbit rings and a particle field (Three.js + custom GLSL shaders) that reacts to the mouse and scroll
- **3D skills sphere** that spins with the cursor
- **3D tilt + glare** on project cards and the portrait
- Editorial typography (Instrument Serif + Geist), film-grain texture, custom cursor, magnetic buttons
- Scroll-reveal animations, animated counters, intro loader
- **Contact form delivered straight to Gmail** (via FormSubmit) with a Gmail-compose fallback
- Fully responsive, respects `prefers-reduced-motion`, graceful fallback when WebGL is unavailable

## 📱 Sections

Hero · About · Selected Work · Skills · Experience (Invisible Technologies, KloudFarm, Google GDSC) · Contact

## 🛠️ Technologies Used

HTML5 · CSS3 · JavaScript (ES modules) · Three.js r160 · GLSL

## 🎯 Projects Showcased

1. **AI Multi-Agent Orchestration** - React + Redux + OpenAI SDK
2. **LibraryHub** - Java + MySQL + OOP
3. **CineAI** - Next.js 14 + TypeScript + MongoDB
4. **Google Flights Clone** - React 18 + Tailwind CSS

## 🚀 Quick Start

### Option 1: Direct Access
Simply visit the live demo link above to view the portfolio.

### Option 2: Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/ashfarfaizi/Portfolio.git
   cd Portfolio
   ```

2. **Open the project**
   - Double-click `index.html` to open in your browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   ```

3. **View in browser**
   - Navigate to `http://localhost:8000` (if using Python server)
   - Or simply open `index.html` directly

## 📁 Project Structure

```
Myportfolio/
├── index.html            # Page markup
├── css/
│   └── style.css         # All styles
├── js/
│   ├── main.js           # UI: loader, cursor, nav, reveals, tilt, skills sphere, contact form
│   └── scene.js          # Three.js 3D hero scene
├── assets/
│   └── profile-photo.jpg # Profile image
├── README.md
└── DEPLOYMENT.md
```

## 📬 Contact form → Gmail

The form posts to [FormSubmit](https://formsubmit.co), which forwards messages to **ashfar657@gmail.com**.
The very first submission triggers a one-time **"Activate Form"** email from FormSubmit — open it in Gmail and click the link once; every message after that lands in your inbox.
If delivery ever fails, the visitor is offered a pre-filled Gmail draft instead.

## 🎨 Customization

### Changing Profile Photo
Replace `assets/profile-photo.jpg` with your own image (keep the same name).

### Updating Personal Information
- **Name**: Update in multiple locations in `index.html`
- **Contact Info**: Modify the contact section
- **Projects**: Replace project cards with your own work
- **Skills**: Update the skills categories and tags

### Styling Customization
- **Colors**: Modify the CSS custom properties at the top of `css/style.css`
- **Animations**: Adjust keyframe animations for different effects
- **Layout**: Modify grid and flexbox properties

## 🌐 Deployment

### GitHub Pages (Recommended)
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify
2. Or connect your GitHub repository
3. Automatic deployment on every push

### Vercel
1. Import your GitHub repository
2. Automatic deployment with preview URLs

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: ashfar657@gmail.com
- **Phone**: +91 9769968931
- **Location**: Kerala, India
- **Status**: Available for full-time opportunities

---

⭐ **Star this repository if you found it helpful!**
