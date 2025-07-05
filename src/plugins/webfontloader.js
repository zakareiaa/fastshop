/**
 * plugins/webfontloader.js
 *
 * Simple Google Fonts loader without external dependencies
 */

export async function loadFonts() {
  try {
    // Create a link element for Public Sans (English/French)
    const publicSansLink = document.createElement('link')
    publicSansLink.rel = 'stylesheet'
    publicSansLink.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
    
    // Create a link element for IBM Plex Sans Arabic (Modern Arabic font)
    const arabicFontLink = document.createElement('link')
    arabicFontLink.rel = 'stylesheet'
    arabicFontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'
    
    // Add both fonts to document head
    document.head.appendChild(publicSansLink)
    document.head.appendChild(arabicFontLink)
    
    console.log('Google Fonts loaded successfully')
  } catch (error) {
    console.error('Failed to load Google Fonts:', error)
  }
}
export default function () {
  loadFonts()
}
