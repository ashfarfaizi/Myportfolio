# 🚀 Deployment Guide

This guide will help you deploy your portfolio to GitHub Pages for free hosting with a direct link.

## 🌟 GitHub Pages Deployment (Recommended)

### Step 1: Push to GitHub
1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `Portfolio`
   - Make it public
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/ashfarfaizi/Portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch
6. Click **Save**

### Step 3: Access Your Portfolio
- Your portfolio will be available at: `https://ashfarfaizi.github.io/Portfolio/`
- It may take a few minutes to deploy initially

## 🔄 Alternative Deployment Options

### Netlify (Drag & Drop)
1. Go to [Netlify](https://netlify.com)
2. Drag your entire portfolio folder to the deploy area
3. Get a random URL like `https://random-name.netlify.app`
4. You can customize the URL in settings

### Netlify (GitHub Integration)
1. Connect your GitHub account to Netlify
2. Select your Portfolio repository
3. Deploy automatically on every push

### Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with automatic preview URLs

## 📝 Important Notes

### File Structure
Make sure your files are organized like this:
```
Portfolio/
├── index.html              # Main file (must be named index.html)
├── profile-photo.jpg.jpeg  # Your photo
├── README.md              # Documentation
└── DEPLOYMENT.md          # This file
```

### GitHub Pages Requirements
- Repository must be public (for free accounts)
- Main file must be named `index.html`
- Branch must be named `main` or `master`

### Custom Domain (Optional)
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In GitHub Pages settings, add your custom domain
3. Update DNS settings with your domain provider

## 🐛 Troubleshooting

### Portfolio Not Loading
- Check if `index.html` is in the root directory
- Ensure repository is public
- Wait 5-10 minutes for initial deployment

### Images Not Showing
- Verify image file paths are correct
- Check if image files are committed to GitHub
- Use relative paths (e.g., `profile-photo.jpg.jpeg`)

### Styling Issues
- Clear browser cache
- Check browser console for errors
- Ensure all CSS is properly linked

## 🔗 Final Steps

1. **Update README.md** with your actual GitHub Pages URL
2. **Test all links** in your portfolio
3. **Share your portfolio** with potential employers
4. **Keep it updated** with new projects

## 📞 Need Help?

If you encounter any issues:
1. Check GitHub Pages documentation
2. Look at the repository settings
3. Verify all files are properly committed

---

🎉 **Congratulations! Your portfolio is now live and accessible to anyone with the link!**
