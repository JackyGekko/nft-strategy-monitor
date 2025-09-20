#!/bin/bash

echo "🚀 Setting up GitHub repository for NFT Strategy Monitor"
echo ""

echo "📋 Steps to complete:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: nft-strategy-monitor"
echo "3. Description: NFT Strategy Contract Monitor and Executor"
echo "4. Make it Public"
echo "5. Don't initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""

echo "⏳ Waiting for you to create the repository..."
echo "Press Enter when you've created the repository on GitHub..."
read

echo "📤 Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Your repository is now available at:"
    echo "https://github.com/JackyGekko/nft-strategy-monitor"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Deploy automatically"
else
    echo "❌ Failed to push to GitHub. Please check:"
    echo "- Repository exists on GitHub"
    echo "- You have push access"
    echo "- Internet connection is working"
fi
